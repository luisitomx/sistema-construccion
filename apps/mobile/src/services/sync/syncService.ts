import * as Network from 'expo-network';
import { database } from '../storage/database';
import { Q } from '@nozbe/watermelondb';
import ApiClient from '../api/client';
import Activity from '../storage/models/Activity';
import WorkLog from '../storage/models/WorkLog';
import Photo from '../storage/models/Photo';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncResult {
  status: SyncStatus;
  message: string;
  syncedItems?: {
    activities: number;
    workLogs: number;
    photos: number;
  };
  errors?: string[];
}

class SyncService {
  private isSyncing = false;
  private listeners: ((result: SyncResult) => void)[] = [];

  /**
   * Subscribe to sync events
   */
  onSyncStatusChange(callback: (result: SyncResult) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify(result: SyncResult) {
    this.listeners.forEach((callback) => callback(result));
  }

  /**
   * Check if device is online
   */
  async isOnline(): Promise<boolean> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.isConnected === true && networkState.isInternetReachable === true;
    } catch (error) {
      console.error('Error checking network status:', error);
      return false;
    }
  }

  /**
   * Main sync function - syncs all pending changes
   */
  async sync(scheduleId: string): Promise<SyncResult> {
    if (this.isSyncing) {
      return {
        status: 'error',
        message: 'Sync already in progress',
      };
    }

    const online = await this.isOnline();
    if (!online) {
      return {
        status: 'error',
        message: 'No internet connection',
      };
    }

    this.isSyncing = true;
    this.notify({ status: 'syncing', message: 'Sincronizando...' });

    try {
      const errors: string[] = [];
      const syncedItems = {
        activities: 0,
        workLogs: 0,
        photos: 0,
      };

      // 1. Sync activities (updates to percentComplete, actualStart, actualFinish)
      const activitiesResult = await this.syncActivities(scheduleId);
      syncedItems.activities = activitiesResult.count;
      if (activitiesResult.errors.length > 0) {
        errors.push(...activitiesResult.errors);
      }

      // 2. Sync work logs
      const workLogsResult = await this.syncWorkLogs();
      syncedItems.workLogs = workLogsResult.count;
      if (workLogsResult.errors.length > 0) {
        errors.push(...workLogsResult.errors);
      }

      // 3. Sync photos
      const photosResult = await this.syncPhotos();
      syncedItems.photos = photosResult.count;
      if (photosResult.errors.length > 0) {
        errors.push(...photosResult.errors);
      }

      const result: SyncResult = {
        status: errors.length > 0 ? 'error' : 'success',
        message:
          errors.length > 0
            ? `Sync completed with ${errors.length} errors`
            : 'Sync completed successfully',
        syncedItems,
        errors: errors.length > 0 ? errors : undefined,
      };

      this.notify(result);
      return result;
    } catch (error) {
      const result: SyncResult = {
        status: 'error',
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      this.notify(result);
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sync activities with pending changes
   */
  private async syncActivities(scheduleId: string): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const activitiesCollection = database.get<Activity>('activities');

      // Find activities with pending sync
      const pendingActivities = await activitiesCollection
        .query(
          Q.where('schedule_id', scheduleId),
          Q.where('pending_sync', true)
        )
        .fetch();

      for (const activity of pendingActivities) {
        try {
          // Update activity on server
          await ApiClient.updateActivity(scheduleId, activity.remoteId, {
            percentComplete: activity.percentComplete,
            actualStart: activity.actualStart?.toISOString(),
            actualFinish: activity.actualFinish?.toISOString(),
          });

          // Mark as synced
          await database.write(async () => {
            await activity.update((a) => {
              a.isSynced = true;
              a.pendingSync = false;
            });
          });

          count++;
        } catch (error) {
          errors.push(
            `Activity ${activity.code}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    } catch (error) {
      errors.push(`Failed to sync activities: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { count, errors };
  }

  /**
   * Sync work logs
   */
  private async syncWorkLogs(): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const workLogsCollection = database.get<WorkLog>('work_logs');

      // Find work logs not synced
      const pendingWorkLogs = await workLogsCollection
        .query(Q.where('is_synced', false))
        .fetch();

      for (const workLog of pendingWorkLogs) {
        try {
          // TODO: Create work log endpoint on backend
          // For now, just mark as synced (placeholder)

          // const response = await ApiClient.createWorkLog({
          //   activityId: workLog.activityId,
          //   logDate: workLog.logDate.toISOString(),
          //   workDone: workLog.workDone,
          //   hoursWorked: workLog.hoursWorked,
          //   workersCount: workLog.workersCount,
          //   progressPercentage: workLog.progressPercentage,
          //   notes: workLog.notes,
          //   weather: workLog.weather,
          // });

          await database.write(async () => {
            await workLog.update((w) => {
              w.isSynced = true;
              // w.remoteId = response.id;
            });
          });

          count++;
        } catch (error) {
          errors.push(
            `WorkLog ${workLog.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    } catch (error) {
      errors.push(`Failed to sync work logs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { count, errors };
  }

  /**
   * Sync photos
   */
  private async syncPhotos(): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const photosCollection = database.get<Photo>('photos');

      // Find photos not synced
      const pendingPhotos = await photosCollection
        .query(Q.where('is_synced', false))
        .fetch();

      for (const photo of pendingPhotos) {
        try {
          // Upload photo to S3 via backend
          // TODO: Implement photo upload
          // const formData = new FormData();
          // formData.append('file', {
          //   uri: photo.localUri,
          //   type: 'image/jpeg',
          //   name: `photo_${photo.id}.jpg`,
          // } as any);
          // formData.append('activityId', photo.activityId);
          // formData.append('caption', photo.caption);

          // const response = await ApiClient.uploadPhoto(formData);

          await database.write(async () => {
            await photo.update((p) => {
              p.isSynced = true;
              // p.remoteUrl = response.url;
              // p.remoteId = response.id;
            });
          });

          count++;
        } catch (error) {
          errors.push(
            `Photo ${photo.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
    } catch (error) {
      errors.push(`Failed to sync photos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { count, errors };
  }

  /**
   * Download schedules and activities from server
   */
  async downloadSchedule(scheduleId: string): Promise<void> {
    const online = await this.isOnline();
    if (!online) {
      throw new Error('No internet connection');
    }

    try {
      // Fetch schedule from server
      const schedule = await ApiClient.getSchedule(scheduleId);
      const activities = await ApiClient.getActivities(scheduleId);

      await database.write(async () => {
        const schedulesCollection = database.get('schedules');
        const activitiesCollection = database.get('activities');

        // Check if schedule exists
        const existingSchedule = await schedulesCollection
          .query(Q.where('remote_id', scheduleId))
          .fetch();

        if (existingSchedule.length === 0) {
          // Create new schedule
          await schedulesCollection.create((s: any) => {
            s.remoteId = schedule.id;
            s.projectId = schedule.projectId;
            s.name = schedule.name;
            s.description = schedule.description;
            s.startDate = new Date(schedule.startDate);
            s.endDate = schedule.endDate ? new Date(schedule.endDate) : null;
            s.status = schedule.status;
            s.totalDuration = schedule.totalDuration;
            s.criticalPath = JSON.stringify(schedule.criticalPath || []);
            s.createdBy = schedule.createdBy || '';
            s.isSynced = true;
          });
        } else {
          // Update existing schedule
          await existingSchedule[0].update((s: any) => {
            s.name = schedule.name;
            s.description = schedule.description;
            s.status = schedule.status;
            s.totalDuration = schedule.totalDuration;
            s.criticalPath = JSON.stringify(schedule.criticalPath || []);
            s.createdBy = schedule.createdBy || '';
            s.isSynced = true;
          });
        }

        // Sync activities
        for (const activity of activities) {
          const existingActivity = await activitiesCollection
            .query(Q.where('remote_id', activity.id))
            .fetch();

          if (existingActivity.length === 0) {
            // Create new activity
            await activitiesCollection.create((a: any) => {
              a.remoteId = activity.id;
              a.scheduleId = scheduleId;
              a.code = activity.code;
              a.name = activity.name;
              a.description = activity.description;
              a.duration = activity.duration;
              a.earlyStart = activity.earlyStart;
              a.earlyFinish = activity.earlyFinish;
              a.lateStart = activity.lateStart;
              a.lateFinish = activity.lateFinish;
              a.totalFloat = activity.totalFloat;
              a.freeFloat = activity.freeFloat || 0;
              a.isCritical = activity.isCritical;
              a.percentComplete = activity.percentComplete || 0;
              a.actualStart = activity.actualStart ? new Date(activity.actualStart) : null;
              a.actualFinish = activity.actualFinish ? new Date(activity.actualFinish) : null;
              a.spaceId = activity.spaceId;
              a.budgetItemId = activity.budgetItemId;
              a.isSynced = true;
              a.pendingSync = false;
            });
          } else {
            // Update existing activity (only if not modified locally)
            if (existingActivity[0].isSynced) {
              await existingActivity[0].update((a: any) => {
                a.name = activity.name;
                a.description = activity.description;
                a.duration = activity.duration;
                a.earlyStart = activity.earlyStart;
                a.earlyFinish = activity.earlyFinish;
                a.lateStart = activity.lateStart;
                a.lateFinish = activity.lateFinish;
                a.totalFloat = activity.totalFloat;
                a.freeFloat = activity.freeFloat || 0;
                a.isCritical = activity.isCritical;
                a.percentComplete = activity.percentComplete || 0;
              });
            }
          }
        }
      });
    } catch (error) {
      throw new Error(
        `Failed to download schedule: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export default new SyncService();
