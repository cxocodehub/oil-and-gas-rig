import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Equipment } from '@/types';
import StatusBadge from './StatusBadge';
import { Wrench } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

interface EquipmentCardProps {
  equipment: Equipment;
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { id, name, type, status, healthScore, sensors } = equipment;
  
  // Calculate critical sensors
  const criticalSensors = sensors.filter(s => s.status === 'critical').length;
  const warningSensors = sensors.filter(s => s.status === 'warning').length;
  
  // Get health score color
  const getHealthScoreColor = () => {
    if (healthScore >= 80) return colors.status.success;
    if (healthScore >= 60) return colors.status.warning;
    return colors.status.danger;
  };
  
  const handlePress = () => {
    router.push(`/equipment/${id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.secondary.main}20` }]}>
          <Wrench size={20} color={colors.secondary.main} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.name, { color: colors.text.primary }]}>{name}</Text>
          <Text style={[styles.type, { color: colors.text.secondary }]}>{type}</Text>
        </View>
        <StatusBadge status={status} />
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Health Score</Text>
          <Text style={[styles.infoValue, { color: getHealthScoreColor() }]}>
            {healthScore}%
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Sensors</Text>
          <Text style={[styles.infoValue, { color: colors.text.primary }]}>
            {sensors.length} 
            {criticalSensors > 0 && <Text style={{ color: colors.status.danger }}> ({criticalSensors} critical)</Text>}
            {warningSensors > 0 && criticalSensors === 0 && <Text style={{ color: colors.status.warning }}> ({warningSensors} warning)</Text>}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Location</Text>
          <Text style={[styles.infoValue, { color: colors.text.primary }]} numberOfLines={1}>
            {equipment.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  type: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});