/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Difficulty,
  EquationTemplate,
  ExerciseFormat,
  Question,
  TopicId,
} from '../types.ts';
import { SeededRNG, defaultRng } from './rng.ts';
import { verifyQuestion } from './verify.ts';
import { generateDistractors } from './distractors.ts';
import { WORD_ITEMS, STUDENT_NAMES, WORD_PROBLEM_TEMPLATES } from '../data/wordProblems.ts';

export interface GenerateOptions {
  topicId?: TopicId;
  template?: EquationTemplate;
  format?: ExerciseFormat;
  difficulty?: Difficulty;
  rng?: SeededRNG;
  excludeSignatures?: Set<string>;
}

export function generateQuestion(options: GenerateOptions = {}): Question {
  const rng = options.rng ?? defaultRng;
  const difficulty = options.difficulty ?? 'medium';

  // Range constraints for Grade 2:
  // Easy: 0..10
  // Medium: 0..20
  // Hard: 0..20 or friendly multiples of 10 up to 100
  const maxNumber = difficulty === 'easy' ? 10 : 20;

  let topicId = options.topicId;
  if (!topicId) {
    const candidateTopics: TopicId[] = [
      'add_x_first',
      'add_x_second',
      'sub_x_first',
      'sub_x_second',
      'concept_scale',
      'word_problems',
      'check_solution',
    ];
    topicId = rng.pick(candidateTopics);
  }

  // Max 50 attempts to satisfy all invariants
  for (let attempt = 0; attempt < 50; attempt++) {
    const q = attemptGenerateQuestion(topicId, difficulty, options.format, maxNumber, rng);
    if (
      verifyQuestion(q) &&
      (!options.excludeSignatures || !options.excludeSignatures.has(q.signature))
    ) {
      return q;
    }
  }

  // Safe fallback question if 50 attempts fail
  return createFallbackQuestion(topicId, rng);
}

function attemptGenerateQuestion(
  topicId: TopicId,
  difficulty: Difficulty,
  requestedFormat: ExerciseFormat | undefined,
  maxNumber: number,
  rng: SeededRNG
): Question {
  const id = `q_${Date.now()}_${rng.nextInt(100, 999)}`;
  const unknownSymbol: 'x' | 'box' | 'question' =
    topicId === 'concept_unknown'
      ? 'box'
      : rng.pick(['x', 'x', 'x', 'box', 'question']);

  let template: EquationTemplate = 'ADD_X_FIRST';
  let format: ExerciseFormat = requestedFormat ?? 'mcq';
  let a = 2;
  let b = 5;
  let c: number | undefined;
  let ans: number | boolean = 3;
  let eqStr = 'x + 2 = 5';
  let isAdd = true;
  let wordProblemText;

  switch (topicId) {
    case 'concept_equality':
    case 'check_solution': {
      template = 'CHECK_SOLUTION';
      format = 'tf';
      a = rng.nextInt(1, 8);
      b = rng.nextInt(a + 1, maxNumber);
      const realX = b - a;
      const isTruth = rng.next() > 0.45;
      const proposedX = isTruth ? realX : realX + (rng.next() > 0.5 ? 1 : -1);
      const safeProposed = Math.max(0, proposedX);
      eqStr = `${safeProposed} + ${a} = ${b}`;
      ans = safeProposed + a === b;
      return {
        id,
        template,
        format,
        difficulty,
        topicId,
        operands: { a, b },
        unknownPosition: 'first',
        unknownSymbol,
        equationString: `${unknownSymbol} = ${safeProposed} bo'lsa, ${unknownSymbol} + ${a} = ${b}`,
        answer: ans,
        hintSteps: [
          `Tenglikning ikki tomonini alohida hisoblab ko'r.`,
          `${safeProposed} ga ${a} ni qo'shsak ${safeProposed + a} bo'ladi.`,
          `${safeProposed + a} soni ${b} ga tengmi?`,
        ],
        explanation: `${safeProposed} + ${a} = ${safeProposed + a}. ${safeProposed + a === b ? 'Tenglik to‘g‘ri!' : `Bu ${b} ga teng emas, shuning uchun noto‘g‘ri.`}`,
        signature: `check_${safeProposed}_${a}_${b}`,
      };
    }

    case 'concept_scale': {
      template = 'BALANCE';
      format = requestedFormat ?? 'balance';
      a = rng.nextInt(1, 9);
      b = rng.nextInt(a + 1, maxNumber);
      ans = b - a;
      eqStr = `📦 + ${a} = ${b}`;
      break;
    }

    case 'add_x_first': {
      template = 'ADD_X_FIRST';
      a = rng.nextInt(1, maxNumber - 1);
      ans = rng.nextInt(1, maxNumber - a);
      b = a + ans;
      eqStr = `${unknownSymbol} + ${a} = ${b}`;
      isAdd = true;
      break;
    }

    case 'add_x_second': {
      template = 'ADD_X_SECOND';
      a = rng.nextInt(1, maxNumber - 1);
      ans = rng.nextInt(1, maxNumber - a);
      b = a + ans;
      eqStr = `${a} + ${unknownSymbol} = ${b}`;
      isAdd = true;
      break;
    }

    case 'sub_x_first': {
      template = 'SUB_X_FIRST';
      a = rng.nextInt(1, Math.floor(maxNumber / 2));
      ans = rng.nextInt(a + 1, maxNumber);
      b = ans - a;
      eqStr = `${unknownSymbol} - ${a} = ${b}`;
      isAdd = false;
      break;
    }

    case 'sub_x_second': {
      template = 'SUB_X_SECOND';
      a = rng.nextInt(3, maxNumber);
      b = rng.nextInt(1, a - 1);
      ans = a - b;
      eqStr = `${a} - ${unknownSymbol} = ${b}`;
      isAdd = false;
      break;
    }

    case 'chain_equations': {
      template = 'CHAIN';
      a = rng.nextInt(1, 4);
      c = rng.nextInt(1, 4);
      ans = rng.nextInt(1, maxNumber - (a + c));
      b = ans + a + c;
      eqStr = `${unknownSymbol} + ${a} + ${c} = ${b}`;
      isAdd = true;
      break;
    }

    case 'word_problems': {
      template = 'WORD_PROBLEM';
      format = requestedFormat ?? 'mcq';
      const item = rng.pick(WORD_ITEMS);
      const student = rng.pick(STUDENT_NAMES);
      a = rng.nextInt(2, 8);
      ans = rng.nextInt(2, maxNumber - a);
      b = a + ans;
      isAdd = true;
      eqStr = `x + ${a} = ${b}`;
      wordProblemText = {
        uzLatn: WORD_PROBLEM_TEMPLATES.ADD.uzLatn(student, a, b, item.uzLatn),
        uzCyrl: WORD_PROBLEM_TEMPLATES.ADD.uzCyrl(student, a, b, item.uzCyrl),
        ru: WORD_PROBLEM_TEMPLATES.ADD.ru(student, a, b, item.ru),
      };
      break;
    }

    default: {
      template = 'ADD_X_FIRST';
      a = rng.nextInt(1, 9);
      ans = rng.nextInt(1, 10);
      b = a + ans;
      eqStr = `${unknownSymbol} + ${a} = ${b}`;
      break;
    }
  }

  // Prepare options for MCQ format
  let options: (number | string)[] | undefined;
  if (format === 'mcq' || format === 'balance' || format === 'find_equation') {
    options = generateDistractors(ans as number, { a, b, c }, isAdd, rng, maxNumber);
  }

  // Graded hint ladder
  const hintSteps = isAdd
    ? [
        `Yashirin sonni topish uchun tarozini o‘yla: ikki tomon teng bo‘lishi kerak.`,
        `Qo‘shishning teskari amali — ayirish! ${b} dan ${a} ni ayirib ko‘r.`,
        `${b} - ${a} = ${ans}. Demak, ${unknownSymbol} = ${ans}!`,
      ]
    : [
        `Kamayuvchi yoki ayriluvchini topish qoidasini esla.`,
        `Teskari amalni qo‘lla: ${b} va ${a} ustida hisobla.`,
        `Hisoblasak: natija ${ans} chiqadi!`,
      ];

  const explanation = `${eqStr} tenglamasida ${unknownSymbol} = ${ans}. Chunki tekshirib ko‘rsak to‘g‘ri chiqadi!`;

  return {
    id,
    template,
    format,
    difficulty,
    topicId,
    operands: { a, b, c },
    unknownPosition: 'first',
    unknownSymbol,
    equationString: eqStr,
    answer: ans,
    options,
    hintSteps,
    explanation,
    wordProblemText,
    signature: `${template}_${a}_${b}_${c ?? 0}`,
  };
}

function createFallbackQuestion(topicId: TopicId, rng: SeededRNG): Question {
  const a = 3;
  const b = 7;
  const ans = 4;
  return {
    id: `fb_${Date.now()}`,
    template: 'ADD_X_FIRST',
    format: 'mcq',
    difficulty: 'easy',
    topicId,
    operands: { a, b },
    unknownPosition: 'first',
    unknownSymbol: 'x',
    equationString: 'x + 3 = 7',
    answer: ans,
    options: rng.shuffle([ans, 10, 5, 2]),
    hintSteps: [
      'Tarozining ikki tomoni teng bo‘lishi kerak.',
      '7 dan 3 ni ayirib ko‘ring: 7 - 3 = ?',
      'x = 4 bo‘ladi!',
    ],
    explanation: 'x + 3 = 7 bo‘lsa, x = 7 - 3 = 4.',
    signature: 'fb_add_3_7',
  };
}
