import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import Schedule from './models/Schedule';
import Activity from './models/Activity';
import WorkLog from './models/WorkLog';
import Photo from './models/Photo';

// Create the adapter
const adapter = new SQLiteAdapter({
  schema,
  // optional database name or file system path
  dbName: 'construccion_execution',
  // optional migration definitions
  migrations: [],
});

// Create the database
export const database = new Database({
  adapter,
  modelClasses: [Schedule, Activity, WorkLog, Photo],
});
