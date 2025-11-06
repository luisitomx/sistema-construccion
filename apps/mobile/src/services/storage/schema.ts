import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'schedules',
      columns: [
        { name: 'remote_id', type: 'string', isIndexed: true },
        { name: 'project_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'start_date', type: 'number' },
        { name: 'end_date', type: 'number', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'total_duration', type: 'number' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'activities',
      columns: [
        { name: 'remote_id', type: 'string', isIndexed: true },
        { name: 'schedule_id', type: 'string', isIndexed: true },
        { name: 'code', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'duration', type: 'number' },
        // CPM fields
        { name: 'early_start', type: 'number' },
        { name: 'early_finish', type: 'number' },
        { name: 'late_start', type: 'number' },
        { name: 'late_finish', type: 'number' },
        { name: 'total_float', type: 'number' },
        { name: 'is_critical', type: 'boolean' },
        // Progress
        { name: 'percent_complete', type: 'number' },
        { name: 'actual_start', type: 'number', isOptional: true },
        { name: 'actual_finish', type: 'number', isOptional: true },
        // Integration
        { name: 'space_id', type: 'string', isOptional: true },
        { name: 'budget_item_id', type: 'string', isOptional: true },
        // Sync
        { name: 'is_synced', type: 'boolean' },
        { name: 'pending_sync', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'work_logs',
      columns: [
        { name: 'remote_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'activity_id', type: 'string', isIndexed: true },
        { name: 'log_date', type: 'number' },
        { name: 'work_done', type: 'string' },
        { name: 'hours_worked', type: 'number' },
        { name: 'workers_count', type: 'number' },
        { name: 'progress_percentage', type: 'number' },
        { name: 'notes', type: 'string' },
        { name: 'weather', type: 'string' },
        { name: 'reported_by', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'photos',
      columns: [
        { name: 'remote_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'activity_id', type: 'string', isIndexed: true },
        { name: 'local_uri', type: 'string' },
        { name: 'remote_url', type: 'string', isOptional: true },
        { name: 'caption', type: 'string' },
        { name: 'taken_by', type: 'string' },
        { name: 'taken_at', type: 'number' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
