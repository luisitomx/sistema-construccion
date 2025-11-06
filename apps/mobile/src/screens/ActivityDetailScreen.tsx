import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { database } from '../services/storage/database';
import Activity from '../services/storage/models/Activity';
import { format } from 'date-fns';

export default function ActivityDetailScreen({ route, navigation }: any) {
  const { activityId } = route.params;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    try {
      const activitiesCollection = database.get<Activity>('activities');
      const act = await activitiesCollection.find(activityId);
      setActivity(act);
      setProgress(act.percentComplete);
    } catch (error) {
      console.error('Error loading activity:', error);
      Alert.alert('Error', 'No se pudo cargar la actividad');
      navigation.goBack();
    }
  };

  const handleStartActivity = async () => {
    if (!activity) return;

    Alert.alert(
      'Iniciar Actividad',
      '¿Desea marcar esta actividad como iniciada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: async () => {
            try {
              await database.write(async () => {
                await activity.update((a) => {
                  a.actualStart = new Date();
                  if (a.percentComplete === 0) {
                    a.percentComplete = 5;
                  }
                  a.pendingSync = true;
                  a.isSynced = false;
                });
              });

              await loadActivity();
              Alert.alert('Éxito', 'Actividad iniciada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo iniciar la actividad');
            }
          },
        },
      ]
    );
  };

  const handleUpdateProgress = async () => {
    if (!activity) return;

    setLoading(true);
    try {
      await database.write(async () => {
        await activity.update((a) => {
          a.percentComplete = progress;

          // If completed, set actualFinish
          if (progress === 100 && !a.actualFinish) {
            a.actualFinish = new Date();
          }

          // If started but no actualStart, set it
          if (progress > 0 && !a.actualStart) {
            a.actualStart = new Date();
          }

          a.pendingSync = true;
          a.isSynced = false;
        });
      });

      await loadActivity();
      Alert.alert('Éxito', 'Progreso actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el progreso');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkLog = () => {
    // Navigate to work log screen
    navigation.navigate('AddWorkLog', { activityId: activity?.id });
  };

  const handleTakePhoto = () => {
    // Navigate to photo capture screen
    Alert.alert('Próximamente', 'Función de cámara en desarrollo');
  };

  if (!activity) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  const progressColor =
    progress === 100 ? '#4CAF50' : progress > 0 ? '#FF9800' : '#757575';

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Text style={styles.code}>{activity.code}</Text>
          {activity.isCritical && (
            <View style={styles.criticalBadge}>
              <Text style={styles.criticalText}>⚠️ CRÍTICA</Text>
            </View>
          )}
        </View>

        <Text style={styles.name}>{activity.name}</Text>
        <Text style={styles.description}>{activity.description}</Text>

        {/* Status Badges */}
        <View style={styles.statusRow}>
          {activity.actualStart && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                ✅ Iniciada: {format(new Date(activity.actualStart), 'dd/MM/yyyy')}
              </Text>
            </View>
          )}
          {activity.actualFinish && (
            <View style={[styles.statusBadge, styles.statusBadgeGreen]}>
              <Text style={styles.statusBadgeText}>
                🎯 Finalizada: {format(new Date(activity.actualFinish), 'dd/MM/yyyy')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Avance de Obra</Text>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso Actual</Text>
          <Text style={[styles.progressValue, { color: progressColor }]}>
            {activity.percentComplete}%
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${activity.percentComplete}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.progressUpdateLabel}>Actualizar Progreso</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>0%</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={5}
            value={progress}
            onValueChange={setProgress}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#007AFF"
          />
          <Text style={styles.sliderValue}>100%</Text>
        </View>

        <Text style={styles.newProgressText}>Nuevo progreso: {progress}%</Text>

        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdateProgress}
          disabled={loading || progress === activity.percentComplete}
        >
          <Text style={styles.updateButtonText}>
            {loading ? 'Actualizando...' : 'Actualizar Progreso'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CPM Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información CPM</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duración:</Text>
          <Text style={styles.infoValue}>{activity.duration} días</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Inicio Temprano (ES):</Text>
          <Text style={styles.infoValue}>Día {activity.earlyStart}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fin Temprano (EF):</Text>
          <Text style={styles.infoValue}>Día {activity.earlyFinish}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Holgura Total:</Text>
          <Text style={[styles.infoValue, activity.isCritical && styles.criticalValue]}>
            {activity.totalFloat} días
          </Text>
        </View>

        {activity.isCritical && (
          <View style={styles.criticalWarning}>
            <Text style={styles.criticalWarningText}>
              ⚠️ Esta actividad está en la ruta crítica. No puede retrasarse sin afectar el
              proyecto completo.
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acciones</Text>

        {!activity.actualStart && (
          <TouchableOpacity style={styles.actionButton} onPress={handleStartActivity}>
            <Text style={styles.actionButtonText}>▶️ Iniciar Actividad</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={handleAddWorkLog}>
          <Text style={styles.actionButtonText}>📝 Agregar Reporte Diario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleTakePhoto}>
          <Text style={styles.actionButtonText}>📷 Tomar Foto</Text>
        </TouchableOpacity>
      </View>

      {!activity.isSynced && (
        <View style={styles.unsyncedWarning}>
          <Text style={styles.unsyncedWarningText}>
            ⚠️ Esta actividad tiene cambios pendientes de sincronizar
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  code: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  criticalBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  criticalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  statusRow: {
    marginTop: 15,
  },
  statusBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  statusBadgeGreen: {
    backgroundColor: '#E8F5E9',
  },
  statusBadgeText: {
    fontSize: 13,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressUpdateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  sliderValue: {
    fontSize: 12,
    color: '#666',
    width: 35,
  },
  newProgressText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  criticalValue: {
    color: '#F44336',
  },
  criticalWarning: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  criticalWarningText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  unsyncedWarning: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  unsyncedWarningText: {
    fontSize: 14,
    color: '#E65100',
    textAlign: 'center',
  },
});
