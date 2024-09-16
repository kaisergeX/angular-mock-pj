import { SQLITE_CONSTRAINT_MSG } from '~/constants/sqlite-err';

export function sqliteEnumErr(message: string): SQLITE_CONSTRAINT_MSG {
  for (const constraint of Object.values(SQLITE_CONSTRAINT_MSG)) {
    if (message.includes(`${constraint} constraint failed`)) {
      return constraint;
    }
  }

  return SQLITE_CONSTRAINT_MSG.UNKNOWN;
}
