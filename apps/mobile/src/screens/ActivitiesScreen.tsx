import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { database } from '../services/storage/database';
import Activity from '../services/storage/models/Activity';
import { Q } from '@nozbe/watermelondb';

export default function ActivitiesScreen({ navigation }: any) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'inProgress' | 'critical'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, searchQuery, filter]);

  const loadActivities = async () => {
    try {
      const activitiesCollection = database.get<Activity>('activities');
      const allActivities = await activitiesCollection
        .query(Q.sortBy('early_start', Q.asc))
        .fetch();

      setActivities(allActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === 'inProgress') {
      filtered = filtered.filter((a) => a.percentComplete > 0 && a.percentComplete < 100);
    } else if (filter === 'critical') {
      filtered = filtered.filter((a) => a.isCritical);
    }

    setFilteredActivities(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const renderActivity = ({ item }: { item: Activity }) => {
    const statusColor =
      item.percentComplete === 100
        ? '#4CAF50'
        : item.percentComplete > 0
        ? '#FF9800'
        : '#757575';

    return (
      <TouchableOpacity
        style={styles.activityCard}
        onPress={() => navigation.navigate('ActivityDetail', { activityId: item.id })}
      >
        <View style={styles.activityHeader}>
          <View style={styles.activityHeaderLeft}>
            <Text style={styles.activityCode}>{item.code}</Text>
            {item.isCritical && <View style={styles.criticalBadge}>
              <Text style={styles.criticalBadgeText}>CRÍTICA</Text>
            </View>}
          </View>
          <Text style={[styles.activityProgress, { color: statusColor }]}>
            {item.percentComplete}%
          </Text>
        </View>

        <Text style={styles.activityName}>{item.name}</Text>
        <Text style={styles.activityDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.activityFooter}>
          <View style={styles.activityDuration}>
            <Text style={styles.activityDurationText}>⏱️ {item.duration} días</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${item.percentComplete}%`,
                    backgroundColor: statusColor,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {!item.isSynced && (
          <View style={styles.unsyncedBadge}>
            <Text style={styles.unsyncedText}>⚠️ Pendiente de sincronizar</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar actividad..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            Todas ({activities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'inProgress' && styles.filterTabActive]}
          onPress={() => setFilter('inProgress')}
        >
          <Text
            style={[styles.filterTabText, filter === 'inProgress' && styles.filterTabTextActive]}
          >
            En Progreso (
            {activities.filter((a) => a.percentComplete > 0 && a.percentComplete < 100).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'critical' && styles.filterTabActive]}
          onPress={() => setFilter('critical')}
        >
          <Text style={[styles.filterTabText, filter === 'critical' && styles.filterTabTextActive]}>
            Críticas ({activities.filter((a) => a.isCritical).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Activities List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay actividades</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
  },
  criticalBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  criticalBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F44336',
  },
  activityProgress: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDuration: {
    marginRight: 12,
  },
  activityDurationText: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  unsyncedBadge: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  unsyncedText: {
    fontSize: 12,
    color: '#FF9800',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
