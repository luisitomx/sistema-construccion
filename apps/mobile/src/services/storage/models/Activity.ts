import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import Schedule from './Schedule';

export default class Activity extends Model {
  static table = 'activities';
  static associations = {
    schedules: { type: 'belongs_to', key: 'schedule_id' },
    work_logs: { type: 'has_many', foreignKey: 'activity_id' },
    photos: { type: 'has_many', foreignKey: 'activity_id' },
  };

  @field('remote_id') remoteId!: string;
  @field('schedule_id') scheduleId!: string;
  @field('code') code!: string;
  @field('name') name!: string;
  @field('description') description!: string;
  @field('duration') duration!: number;

  // CPM fields
  @field('early_start') earlyStart!: number;
  @field('early_finish') earlyFinish!: number;
  @field('late_start') lateStart!: number;
  @field('late_finish') lateFinish!: number;
  @field('total_float') totalFloat!: number;
  @field('free_float') freeFloat!: number;
  @field('is_critical') isCritical!: boolean;

  // Progress tracking
  @field('percent_complete') percentComplete!: number;
  @date('actual_start') actualStart!: Date | null;
  @date('actual_finish') actualFinish!: Date | null;

  // Integration
  @field('space_id') spaceId!: string | null;
  @field('budget_item_id') budgetItemId!: string | null;

  // Sync status
  @field('is_synced') isSynced!: boolean;
  @field('pending_sync') pendingSync!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('schedules', 'schedule_id') schedule!: Relation<Schedule>;
  @children('work_logs') workLogs: any;
  @children('photos') photos: any;
}
