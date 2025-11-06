import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { database } from '../services/storage/database';
import Activity from '../services/storage/models/Activity';
import SyncService from '../services/sync/syncService';
import * as Network from 'expo-network';

export default function HomeScreen({ navigation }: any) {
  const [stats, setStats] = useState({
    totalActivities: 0,
    inProgress: 0,
    completed: 0,
    critical: 0,
  });
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
    checkNetworkStatus();

    // Subscribe to sync events
    const unsubscribe = SyncService.onSyncStatusChange((result) => {
      setIsSyncing(result.status === 'syncing');

      if (result.status === 'success') {
        Alert.alert('Éxito', result.message);
        loadStats();
      } else if (result.status === 'error') {
        Alert.alert('Error', result.message);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkNetworkStatus = async () => {
    const online = await SyncService.isOnline();
    setIsOnline(online);
  };

  const loadStats = async () => {
    try {
      const activitiesCollection = database.get<Activity>('activities');
      const allActivities = await activitiesCollection.query().fetch();

      setStats({
        totalActivities: allActivities.length,
        inProgress: allActivities.filter(
          (a) => a.percentComplete > 0 && a.percentComplete < 100
        ).length,
        completed: allActivities.filter((a) => a.percentComplete === 100).length,
        critical: allActivities.filter((a) => a.isCritical).length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSync = async () => {
    // For demo, assuming schedule ID
    const DEMO_SCHEDULE_ID = 'demo-schedule-001';

    setIsSyncing(true);
    try {
      await SyncService.sync(DEMO_SCHEDULE_ID);
    } catch (error) {
      Alert.alert('Error', 'No se pudo sincronizar');
    } finally {
      setIsSyncing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkNetworkStatus();
    await loadStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>{isOnline ? 'En línea' : 'Sin conexión'}</Text>
        </View>
      </View>

      {/* Sync Button */}
      {isOnline && (
        <TouchableOpacity
          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Sincronizando...' : '🔄 Sincronizar'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardBlue]}>
          <Text style={styles.statNumber}>{stats.totalActivities}</Text>
          <Text style={styles.statLabel}>Total Actividades</Text>
        </View>

        <View style={[styles.statCard, styles.statCardOrange]}>
          <Text style={styles.statNumber}>{stats.inProgress}</Text>
          <Text style={styles.statLabel}>En Progreso</Text>
        </View>

        <View style={[styles.statCard, styles.statCardGreen]}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>

        <View style={[styles.statCard, styles.statCardRed]}>
          <Text style={styles.statNumber}>{stats.critical}</Text>
          <Text style={styles.statLabel}>Críticas</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Activities')}
        >
          <Text style={styles.actionButtonIcon}>📋</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Ver Actividades</Text>
            <Text style={styles.actionButtonSubtitle}>Lista de todas las actividades</Text>
          </View>
          <Text style={styles.actionButtonArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Reports')}
        >
          <Text style={styles.actionButtonIcon}>📊</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Reportes Diarios</Text>
            <Text style={styles.actionButtonSubtitle}>Avance y bitácora</Text>
          </View>
          <Text style={styles.actionButtonArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Próximamente', 'Cámara para fotos de avance')}
        >
          <Text style={styles.actionButtonIcon}>📷</Text>
          <View style={styles.actionButtonContent}>
            <Text style={styles.actionButtonTitle}>Tomar Foto</Text>
            <Text style={styles.actionButtonSubtitle}>Evidencia fotográfica</Text>
          </View>
          <Text style={styles.actionButtonArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  syncButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#ccc',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '47%',
    margin: '1.5%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statCardBlue: {
    backgroundColor: '#E3F2FD',
  },
  statCardOrange: {
    backgroundColor: '#FFF3E0',
  },
  statCardGreen: {
    backgroundColor: '#E8F5E9',
  },
  statCardRed: {
    backgroundColor: '#FFEBEE',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  actionButtonArrow: {
    fontSize: 24,
    color: '#ccc',
  },
});
