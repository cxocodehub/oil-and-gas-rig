import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useRigStore } from '@/store/rigStore';
import SensorGauge from '@/components/SensorGauge';
import StatusBadge from '@/components/StatusBadge';
import { Calendar, ArrowLeft, Wrench, AlertTriangle } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function EquipmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stations } = useRigStore();
  const { colors } = useThemeStore();
  
  // Find the equipment across all stations
  const equipment = stations
    .flatMap(station => station.equipment)
    .find(eq => eq.id === id);
  
  // Find which station this equipment belongs to
  const station = stations.find(station => 
    station.equipment.some(eq => eq.id === id)
  );
  
  if (!equipment || !station) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Equipment not found</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.secondary.main }]} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.neutral.white }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Get health score color
  const getHealthScoreColor = () => {
    if (equipment.healthScore >= 80) return colors.status.success;
    if (equipment.healthScore >= 60) return colors.status.warning;
    return colors.status.danger;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: equipment.name,
          headerBackTitle: 'Equipment',
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background.primary }]} 
        contentContainerStyle={styles.contentContainer}
      >
        <LinearGradient
          colors={[colors.gradient.primary[0], colors.gradient.primary[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Wrench size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.equipmentName}>{equipment.name}</Text>
              <Text style={styles.equipmentType}>{equipment.type}</Text>
            </View>
          </View>
          <StatusBadge status={equipment.status} size="large" />
        </LinearGradient>
        
        <View style={[styles.infoCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Health Score</Text>
              <Text style={[styles.infoValue, { color: getHealthScoreColor() }]}>
                {equipment.healthScore}%
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Location</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{equipment.location}</Text>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={styles.infoItemWithIcon}>
                <Calendar size={16} color={colors.text.secondary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Last Maintenance</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{formatDate(equipment.lastMaintenance)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <View style={styles.infoItemWithIcon}>
                <Calendar size={16} color={colors.text.secondary} style={styles.infoIcon} />
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Next Maintenance</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{formatDate(equipment.nextMaintenance)}</Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Sensor Readings</Text>
        
        <View style={styles.sensorsContainer}>
          {equipment.sensors.map(sensor => (
            <SensorGauge key={sensor.id} sensor={sensor} />
          ))}
        </View>
        
        {equipment.status === 'warning' || equipment.status === 'critical' ? (
          <View style={[
            styles.alertCard, 
            { 
              backgroundColor: `${colors.status.danger}15`,
              borderLeftColor: colors.status.danger 
            }
          ]}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color={colors.status.danger} />
              <Text style={[styles.alertTitle, { color: colors.status.danger }]}>
                {equipment.status === 'critical' ? 'Critical Alert' : 'Warning'}
              </Text>
            </View>
            <Text style={[styles.alertMessage, { color: colors.text.primary }]}>
              {equipment.status === 'critical' 
                ? 'This equipment requires immediate attention. Critical sensor readings detected.'
                : 'This equipment requires attention soon. Abnormal sensor readings detected.'}
            </Text>
            <TouchableOpacity style={[styles.alertButton, { backgroundColor: colors.status.danger }]}>
              <Text style={[styles.alertButtonText, { color: colors.neutral.white }]}>Schedule Maintenance</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        
        <View style={styles.stationInfo}>
          <Text style={[styles.stationInfoLabel, { color: colors.text.secondary }]}>Part of</Text>
          <TouchableOpacity 
            style={styles.stationInfoButton}
            onPress={() => router.push(`/station/${station.id}`)}
          >
            <Text style={[styles.stationInfoName, { color: colors.secondary.main }]}>{station.name}</Text>
            <ArrowLeft size={16} color={colors.secondary.main} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  equipmentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  equipmentType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoItem: {
    flex: 1,
    marginBottom: 8,
  },
  infoItemWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sensorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  alertMessage: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  alertButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stationInfoLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  stationInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationInfoName: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    fontWeight: '600',
  },
});