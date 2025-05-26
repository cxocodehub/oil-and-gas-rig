import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRigStore } from '@/store/rigStore';
import EquipmentCard from '@/components/EquipmentCard';
import { useThemeStore } from '@/store/themeStore';

export default function EquipmentScreen() {
  const { stations, fetchStations, isLoading } = useRigStore();
  const { colors } = useThemeStore();
  
  useEffect(() => {
    if (stations.length === 0) {
      fetchStations();
    }
  }, []);
  
  // Flatten all equipment from all stations
  const allEquipment = stations.flatMap(station => 
    station.equipment.map(equipment => ({
      ...equipment,
      stationName: station.name,
      stationId: station.id,
    }))
  );
  
  // Group equipment by status for better organization
  const criticalEquipment = allEquipment.filter(eq => eq.status === 'critical');
  const warningEquipment = allEquipment.filter(eq => eq.status === 'warning');
  const maintenanceEquipment = allEquipment.filter(eq => eq.status === 'maintenance');
  const operationalEquipment = allEquipment.filter(eq => eq.status === 'operational');
  const offlineEquipment = allEquipment.filter(eq => eq.status === 'offline');
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={isLoading} 
          onRefresh={fetchStations}
          tintColor={colors.secondary.main}
          colors={[colors.secondary.main]}
        />
      }
    >
      {criticalEquipment.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Critical Issues</Text>
          {criticalEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </View>
      )}
      
      {warningEquipment.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Warning Status</Text>
          {warningEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </View>
      )}
      
      {maintenanceEquipment.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>In Maintenance</Text>
          {maintenanceEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Operational</Text>
        {operationalEquipment.map(equipment => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </View>
      
      {offlineEquipment.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Offline</Text>
          {offlineEquipment.map(equipment => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});