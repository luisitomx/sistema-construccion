import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Activity from './Activity';

export default class WorkLog extends Model {
  static table = 'work_logs';
  static associations = {
    activities: { type: 'belongs_to', key: 'activity_id' },
  };

  @field('remote_id') remoteId!: string | null;
  @field('activity_id') activityId!: string;
  @date('log_date') logDate!: Date;
  @field('work_done') workDone!: string; // Descripción del trabajo realizado
  @field('hours_worked') hoursWorked!: number;
  @field('workers_count') workersCount!: number;
  @field('progress_percentage') progressPercentage!: number; // Avance del día
  @field('notes') notes!: string;
  @field('weather') weather!: string; // Sunny, Rainy, Cloudy
  @field('reported_by') reportedBy!: string; // User ID
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('activities', 'activity_id') activity!: Relation<Activity>;
}
