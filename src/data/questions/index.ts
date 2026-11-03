import type { Question, QuestionDef, ThemeId } from '../../types';
import { buildQuestion } from '../../services/answers';
import { geography } from './geography';
import { sports } from './sports';
import { movies } from './movies';
import { games } from './games';
import { music } from './music';
import { science } from './science';
import { brands } from './brands';

export const QUESTION_DEFS: QuestionDef[] = [...geography, ...sports, ...movies, ...games, ...music, ...science, ...brands];

export const QUESTIONS: Question[] = QUESTION_DEFS.map(buildQuestion);
export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
export const questionsForTheme = (t: ThemeId) => QUESTIONS.filter((q) => q.theme === t);
