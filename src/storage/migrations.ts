/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppDataEnvelope } from '../types.ts';

export const CURRENT_SCHEMA_VERSION = 1;

export function migrateData(envelope: AppDataEnvelope): AppDataEnvelope {
  if (!envelope.version || envelope.version < 1) {
    envelope.version = 1;
  }
  // Future migrations from v1 -> v2 can be cleanly piped here
  return envelope;
}
