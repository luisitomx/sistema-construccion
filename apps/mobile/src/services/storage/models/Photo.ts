import { Model, Relation } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Activity from './Activity';

export default class Photo extends Model {
  static table = 'photos';
  static associations = {
    activities: { type: 'belongs_to', key: 'activity_id' },
  };

  @field('remote_id') remoteId!: string | null;
  @field('activity_id') activityId!: string;
  @field('local_uri') localUri!: string; // Local file path
  @field('remote_url') remoteUrl!: string | null; // S3 URL after sync
  @field('caption') caption!: string;
  @field('taken_by') takenBy!: string; // User ID
  @date('taken_at') takenAt!: Date;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @relation('activities', 'activity_id') activity!: Relation<Activity>;
}
