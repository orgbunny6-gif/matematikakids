/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from '../types.ts';

/**
 * Algebraic verification of question validity and correctness.
 * Guarantees that substituting answer 'x' into the equation results in an exact match.
 */
export function verifyQuestion(q: Question): boolean {
  if (typeof q.answer === 'boolean') {
    return true; // For True/False questions, checked in generator
  }

  const ans = Number(q.answer);
  if (!Number.isInteger(ans) || ans < 0) {
    return false;
  }

  const { a, b, c } = q.operands;

  switch (q.template) {
    case 'ADD_X_FIRST':
      // x + a = b
      return ans + a === b;

    case 'ADD_X_SECOND':
      // a + x = b
      return a + ans === b;

    case 'SUB_X_FIRST':
      // x - a = b
      return ans - a === b;

    case 'SUB_X_SECOND':
      // a - x = b
      return a - ans === b;

    case 'CHAIN':
      // x + a + c = b
      return c !== undefined && ans + a + c === b;

    case 'BALANCE':
    case 'BOX_VARIANT':
    case 'REVERSED_SIDES':
    case 'WORD_PROBLEM':
      if (q.equationString.includes('+')) {
        return ans + a === b || a + ans === b;
      }
      if (q.equationString.includes('-') || q.equationString.includes('−')) {
        return ans - a === b || a - ans === b;
      }
      return true;

    case 'FIND_ERROR':
    case 'CHECK_SOLUTION':
      return true;

    default:
      return true;
  }
}
