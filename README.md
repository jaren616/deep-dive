# 🐙 Deep Dive

A browser trivia game set in the deep ocean. Each question asks you to *name* something — a country in Africa, a Pixar film, a chemical element. Common answers score a little, rare answers score a lot, and every point sinks you 10 m deeper. A perfect dive (700 points) reaches the bottom of the trench at 7,000 m.

**Play it:** https://jaren616.github.io/deep-dive/

## Features

- **Rarity scoring** — six tiers from 🦠 Plankton (10 pts) to ✨ Krillion (100 pts)
- **56 questions, ~5,500 accepted answers** across 7 themes: Geography, Sports, Movies & TV, Games, Music, Science, Brands
- **Forgiving answers** — ignores capitals, accents and punctuation; suggests fixes for close typos; wrong guesses cost nothing
- **Modes** — Daily Dive (same for everyone, one attempt), Quick Dive, Endless (3 lives), Themes, shareable Challenge codes, 30-day Daily archive
- **Animated ocean** — the water darkens through six real depth zones, with bioluminescent creatures the deeper you go
- **Progress** — stats, daily streaks, 14 badges, an Ocean Journal of real deep-sea creatures
- **Sound** — effects and ambient music made in the browser (no audio files)
- **Accessibility** — reduced motion, colour-blind palette, three text sizes, keyboard play, works on phones

Everything is saved in the player's own browser (localStorage). There are no accounts and no server.

## Running it yourself

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev      # play locally at http://localhost:5173
npm test         # 32 tests: answer matching, scoring, daily rules, saves, stats, content checks
npm run build    # production build in dist/
```

`dist/` is a plain static site (relative paths), so it can be hosted anywhere: GitHub Pages, Netlify, or any web server.

## Hosting

Every push to `main` runs the tests, builds the game and publishes it to GitHub Pages using `.github/workflows/deploy.yml`.

One-time setup: in the repository on GitHub go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Changing the game

| What | Where |
| --- | --- |
| Questions and answers | `src/data/questions/*.ts` — one file per theme |
| Tier names and points | `src/config/rarity.ts` |
| Questions per dive, timer, metres per point | `src/config/game.ts` |
| Badges | `src/services/achievements.ts` |
| Ocean Journal creatures | `src/services/journal.ts` |

Answers are listed by tier as `"Name|alias|alias"`. Run `npm test` afterwards: the content checks catch duplicate answers and empty questions.

Players can 🚩 flag answers they think should count. Flags are saved in their browser, and **Settings → Flagged answers → Copy list** gives you a list to add.

## Known limits

- No multiplayer, accounts or global leaderboards (they would need a server). Challenge codes let friends compare scores on the same questions.
- Rarity tiers were set by hand, not from real player data.
- “Open” questions (bands, islands, dinosaurs…) can't list every valid answer. That's what flagging is for.
