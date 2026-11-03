import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DiveRecord, DiveSetup, SaveData } from './types';
import { useNow, usePrefersReducedMotion, useSave } from './hooks';
import { todayKey } from './services/daily';
import { startDive, type DiveState, toRecord } from './services/engine';
import { evaluateAchievements } from './services/achievements';
import { computeStats } from './services/stats';
import { audio } from './services/audio';
import { emptySave, clearSave } from './services/storage';
import OceanCanvas from './components/scene/OceanCanvas';
import HomeScreen from './components/screens/HomeScreen';
import DiveScreen from './components/screens/DiveScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import StatsScreen from './components/screens/StatsScreen';
import AchievementsScreen from './components/screens/AchievementsScreen';
import JournalScreen from './components/screens/JournalScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import ThemesScreen from './components/screens/ThemesScreen';
import CustomScreen from './components/screens/CustomScreen';
import ArchiveScreen from './components/screens/ArchiveScreen';
import HelpScreen from './components/screens/HelpScreen';

export type Route =
  | { name: 'home' }
  | { name: 'dive'; state: DiveState }
  | { name: 'results'; dive: DiveRecord; newAchievements: string[]; personalBest: boolean }
  | { name: 'stats' }
  | { name: 'achievements' }
  | { name: 'journal' }
  | { name: 'settings' }
  | { name: 'themes' }
  | { name: 'custom'; code?: string }
  | { name: 'archive' }
  | { name: 'help' };

const MAX_STORED_DIVES = 500;

export default function App() {
  const { save, update, setSave, recovered, canStore } = useSave();
  const now = useNow();
  const today = todayKey(now);
  const prefersReduced = usePrefersReducedMotion();
  const [route, setRoute] = useState<Route>(() => {
    // Shareable challenge links: ...#c=DD-XXXX
    const m = /[#&]c=([\w-]+)/.exec(window.location.hash);
    return m ? { name: 'custom', code: m[1] } : { name: 'home' };
  });
  const [sceneDepth, setSceneDepth] = useState(0);
  const [burst, setBurst] = useState<{ id: number; color: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(recovered ? 'Your saved progress was damaged and has been reset. Sorry about that!' : null);

  const saveRef = useRef(save);
  saveRef.current = save;
  const settings = save.settings;
  const reducedMotion = settings.reducedMotion || prefersReduced;

  useEffect(() => audio.setSound(settings.sound), [settings.sound]);
  useEffect(() => {
    if (settings.music !== audio.musicOn) audio.setMusic(settings.music);
  }, [settings.music]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textSize = settings.textSize;
    root.classList.toggle('reduced-motion', reducedMotion);
    root.classList.toggle('color-blind', settings.colorBlind);
  }, [settings.textSize, reducedMotion, settings.colorBlind]);

  // The scene sits at the surface everywhere except during and after a dive.
  useEffect(() => {
    if (route.name === 'results') setSceneDepth(route.dive.depth);
    else if (route.name !== 'dive') setSceneDepth(0);
  }, [route]);

  // Clear the challenge hash once it has been read so a refresh doesn't reopen it.
  useEffect(() => {
    if (route.name !== 'custom' && window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [route.name]);

  const go = useCallback((r: Route) => {
    setRoute(r);
    window.scrollTo(0, 0);
  }, []);

  const beginDive = useCallback(
    (setup: DiveSetup) => {
      if (setup.mode === 'daily' && setup.date && save.dailyResults[setup.date]) {
        go({ name: 'results', dive: save.dailyResults[setup.date], newAchievements: [], personalBest: false });
        return;
      }
      // Never let a new dive overwrite an unfinished Daily Dive (that would allow a re-roll).
      const ip = save.inProgress;
      if (ip?.setup.mode === 'daily' && !(setup.mode === 'daily' && setup.date === ip.setup.date)) {
        setNotice('Finish your Daily Dive first — tap Resume on the home screen.');
        go({ name: 'home' });
        return;
      }
      audio.unlock();
      audio.splash();
      const state = startDive(setup);
      update((s) => ({ ...s, inProgress: { setup, rounds: [], current: -1, startedAt: Date.now() } }));
      setSceneDepth(0);
      go({ name: 'dive', state });
    },
    [save.dailyResults, save.inProgress, update, go],
  );

  const finishDive = useCallback(
    (state: DiveState) => {
      const record = toRecord(state);
      const prev = saveRef.current;
      const prevBest = computeStats(prev, today).bestDepth;
      const personalBest = record.depth > 0 && record.depth > prevBest;
      const next: SaveData = {
        ...prev,
        inProgress: null,
        dives: [...prev.dives, record].slice(-MAX_STORED_DIVES),
        dailyResults: record.mode === 'daily' && record.date && !prev.dailyResults[record.date] ? { ...prev.dailyResults, [record.date]: record } : prev.dailyResults,
        discoveredTiers: Array.from(new Set([...prev.discoveredTiers, ...record.rounds.flatMap((r) => (r.tier ? [r.tier] : []))])),
      };
      const unlocked = evaluateAchievements(next, record, today);
      const stamp = Date.now();
      next.achievements = { ...next.achievements, ...Object.fromEntries(unlocked.map((id) => [id, stamp])) };
      saveRef.current = next;
      setSave(next);
      if (unlocked.length) setTimeout(() => audio.achievement(), 600);
      go({ name: 'results', dive: record, newAchievements: unlocked, personalBest });
    },
    [setSave, today, go],
  );

  const resumeDive = useCallback(() => {
    const ip = save.inProgress;
    if (!ip) return;
    audio.unlock();
    const rounds = [...ip.rounds];
    // Anti-cheat: a question that was on screen when the dive was left counts as missed.
    if (ip.current === rounds.length && ip.current < ip.setup.questionIds.length) {
      rounds.push({ questionId: ip.setup.questionIds[ip.current], outcome: 'missed', points: 0, timeTaken: 0 });
    }
    const state = startDive(ip.setup, rounds);
    update((s) => ({ ...s, inProgress: { ...ip, rounds, current: -1 } }));
    if (state.finished) finishDive(state);
    else go({ name: 'dive', state });
  }, [save.inProgress, update, go, finishDive]);

  const onShown = useCallback((index: number) => update((s) => (s.inProgress ? { ...s, inProgress: { ...s.inProgress, current: index } } : s)), [update]);

  const onRound = useCallback(
    (state: DiveState) => update((s) => (s.inProgress ? { ...s, inProgress: { ...s.inProgress, rounds: state.rounds, current: -1 } } : s)),
    [update],
  );

  const quitDive = useCallback(() => go({ name: 'home' }), [go]);

  const abandonDive = useCallback(() => update((s) => ({ ...s, inProgress: null })), [update]);

  const flagAnswer = useCallback(
    (questionId: string, typed: string) =>
      update((s) => ({ ...s, flagged: [...s.flagged.filter((f) => !(f.questionId === questionId && f.typed === typed)), { questionId, typed, at: Date.now() }].slice(-200) })),
    [update],
  );

  const resetAll = useCallback(() => {
    clearSave();
    setSave({ ...emptySave(), settings: save.settings });
    go({ name: 'home' });
    setNotice('All progress has been reset.');
  }, [setSave, save.settings, go]);

  const stats = useMemo(() => computeStats(save, today), [save, today]);

  let content;
  switch (route.name) {
    case 'dive':
      content = (
        <DiveScreen
          key={route.state.setup.questionIds.join(',') + route.state.rounds.length}
          initial={route.state}
          settings={settings}
          onShown={onShown}
          onRound={onRound}
          onFinish={finishDive}
          onQuit={quitDive}
          onFlag={flagAnswer}
          onDepth={setSceneDepth}
          onBurst={(color) => setBurst((b) => ({ id: (b?.id ?? 0) + 1, color }))}
        />
      );
      break;
    case 'results':
      content = <ResultsScreen dive={route.dive} newAchievements={route.newAchievements} personalBest={route.personalBest} settings={settings} today={today} onHome={() => go({ name: 'home' })} onAgain={beginDive} />;
      break;
    case 'stats':
      content = <StatsScreen save={save} stats={stats} settings={settings} onBack={() => go({ name: 'home' })} onOpen={(d) => go({ name: 'results', dive: d, newAchievements: [], personalBest: false })} />;
      break;
    case 'achievements':
      content = <AchievementsScreen save={save} onBack={() => go({ name: 'home' })} />;
      break;
    case 'journal':
      content = <JournalScreen bestDepth={stats.bestDepth} onBack={() => go({ name: 'home' })} />;
      break;
    case 'settings':
      content = <SettingsScreen save={save} update={update} canStore={canStore} onReset={resetAll} onBack={() => go({ name: 'home' })} />;
      break;
    case 'themes':
      content = <ThemesScreen onBack={() => go({ name: 'home' })} onStart={beginDive} />;
      break;
    case 'custom':
      content = <CustomScreen initialCode={route.code} onBack={() => go({ name: 'home' })} onStart={beginDive} />;
      break;
    case 'archive':
      content = <ArchiveScreen save={save} today={today} onBack={() => go({ name: 'home' })} onStart={beginDive} />;
      break;
    case 'help':
      content = <HelpScreen settings={settings} onBack={() => go({ name: 'home' })} />;
      break;
    default:
      content = (
        <HomeScreen
          save={save}
          stats={stats}
          today={today}
          now={now}
          onStart={beginDive}
          onResume={resumeDive}
          onAbandon={abandonDive}
          onViewDaily={(d) => go({ name: 'results', dive: d, newAchievements: [], personalBest: false })}
          go={go}
        />
      );
  }

  return (
    <>
      <OceanCanvas depth={sceneDepth} reducedMotion={reducedMotion} burst={burst} />
      {notice && (
        <div className="toast" role="status">
          <span>{notice}</span>
          <button className="btn ghost small" onClick={() => setNotice(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}
      {!canStore && route.name === 'home' && <div className="storage-warning">Saving is blocked in this browser, so progress won't be kept after you close the page.</div>}
      {content}
    </>
  );
}
