import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class Schedule extends Model {
  static table = 'schedules';
  static associations = {
    activities: { type: 'has_many', foreignKey: 'schedule_id' },
  };

  @field('remote_id') remoteId!: string;
  @field('project_id') projectId!: string;
  @field('name') name!: string;
  @field('description') description!: string;
  @date('start_date') startDate!: Date;
  @date('end_date') endDate!: Date | null;
  @field('status') status!: string; // DRAFT, BASELINE, IN_PROGRESS, COMPLETED
  @field('total_duration') totalDuration!: number;
  @field('critical_path') criticalPath!: string; // JSON string array of activity IDs
  @field('created_by') createdBy!: string;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @children('activities') activities: any;
}
