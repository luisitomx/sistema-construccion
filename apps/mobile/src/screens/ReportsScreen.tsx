import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { database } from '../services/storage/database';
import WorkLog from '../services/storage/models/WorkLog';
import { format } from 'date-fns';
import { Q } from '@nozbe/watermelondb';

export default function ReportsScreen({ navigation }: any) {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWorkLogs();
  }, []);

  const loadWorkLogs = async () => {
    try {
      const workLogsCollection = database.get<WorkLog>('work_logs');
      const logs = await workLogsCollection
        .query(Q.sortBy('log_date', Q.desc))
        .fetch();

      setWorkLogs(logs);
    } catch (error) {
      console.error('Error loading work logs:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkLogs();
    setRefreshing(false);
  };

  const renderWorkLog = ({ item }: { item: WorkLog }) => {
    const weatherEmoji =
      item.weather === 'Sunny' ? '☀️' : item.weather === 'Rainy' ? '🌧️' : '☁️';

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <Text style={styles.logDate}>
            {format(new Date(item.logDate), 'dd/MM/yyyy')}
          </Text>
          <Text style={styles.weather}>{weatherEmoji} {item.weather}</Text>
        </View>

        <Text style={styles.logWork}>{item.workDone}</Text>

        <View style={styles.logStats}>
          <View style={styles.logStat}>
            <Text style={styles.logStatLabel}>Horas:</Text>
            <Text style={styles.logStatValue}>{item.hoursWorked}h</Text>
          </View>

          <View style={styles.logStat}>
            <Text style={styles.logStatLabel}>Trabajadores:</Text>
            <Text style={styles.logStatValue}>{item.workersCount}</Text>
          </View>

          <View style={styles.logStat}>
            <Text style={styles.logStatLabel}>Avance:</Text>
            <Text style={styles.logStatValue}>{item.progressPercentage}%</Text>
          </View>
        </View>

        {item.notes && (
          <View style={styles.logNotes}>
            <Text style={styles.logNotesLabel}>Notas:</Text>
            <Text style={styles.logNotesText}>{item.notes}</Text>
          </View>
        )}

        {!item.isSynced && (
          <View style={styles.unsyncedBadge}>
            <Text style={styles.unsyncedText}>⚠️ Pendiente de sincronizar</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reportes Diarios</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddWorkLog')}
        >
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workLogs}
        renderItem={renderWorkLog}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📝</Text>
            <Text style={styles.emptyTitle}>No hay reportes</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primer reporte diario de avance
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddWorkLog')}
            >
              <Text style={styles.emptyButtonText}>Crear Reporte</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weather: {
    fontSize: 14,
    color: '#666',
  },
  logWork: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  logStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  logStat: {
    alignItems: 'center',
  },
  logStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  logStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logNotes: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FFF9C4',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FBC02D',
  },
  logNotesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57F17',
    marginBottom: 4,
  },
  logNotesText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
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
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
