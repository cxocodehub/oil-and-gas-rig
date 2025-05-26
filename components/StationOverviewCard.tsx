import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { RigStation } from '@/types';
import StatusBadge from './StatusBadge';
import { MapPin, Droplet, Wind, Thermometer } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

interface StationOverviewCardProps {
  station: RigStation;
}

export default function StationOverviewCard({ station }: StationOverviewCardProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  const { id, name, location, status, environmentalData, productionData } = station;
  
  const handlePress = () => {
    router.push(`/station/${id}`);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.name, { color: colors.text.primary }]}>{name}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.text.secondary} style={styles.locationIcon} />
            <Text style={[styles.location, { color: colors.text.secondary }]}>{location.name}</Text>
          </View>
        </View>
        <StatusBadge status={status} />
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.background.secondary }]} />
      
      <View style={styles.statsContainer}>
        <View style={styles.statsColumn}>
          <Text style={[styles.statsTitle, { color: colors.text.primary }]}>Production</Text>
          
          <View style={styles.statItem}>
            <Droplet size={16} color={colors.secondary.main} style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Oil:</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{productionData.oilProduction.toFixed(0)} bbl/d</Text>
          </View>
          
          <View style={styles.statItem}>
            <Droplet size={16} color={colors.accent.orange} style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Gas:</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{productionData.gasProduction.toFixed(0)} mcf/d</Text>
          </View>
          
          <View style={styles.statItem}>
            <Droplet size={16} color={colors.status.info} style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Water:</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{productionData.waterProduction.toFixed(0)} bbl/d</Text>
          </View>
        </View>
        
        <View style={styles.statsColumn}>
          <Text style={[styles.statsTitle, { color: colors.text.primary }]}>Environment</Text>
          
          <View style={styles.statItem}>
            <Wind size={16} color={colors.text.secondary} style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Wind:</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{environmentalData.windSpeed.toFixed(1)} mph</Text>
          </View>
          
          <View style={styles.statItem}>
            <Thermometer size={16} color={colors.text.secondary} style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Temp:</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{environmentalData.temperature.toFixed(1)} °C</Text>
          </View>
          
          <View style={styles.statItem}>
            <Droplet size={16} color={colors.text.secondary} style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Humidity:</Text>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>{environmentalData.humidity.toFixed(0)}%</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.efficiencyContainer}>
          <Text style={[styles.efficiencyLabel, { color: colors.text.secondary }]}>Efficiency</Text>
          <View style={[styles.efficiencyBarContainer, { backgroundColor: colors.background.secondary }]}>
            <LinearGradient
              colors={
                productionData.efficiency >= 80 ? ['#38A169', '#68D391'] :
                productionData.efficiency >= 60 ? ['#ECC94B', '#F6E05E'] :
                ['#E53E3E', '#FC8181']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.efficiencyBar, 
                { width: `${productionData.efficiency}%` }
              ]} 
            />
          </View>
          <Text style={[styles.efficiencyValue, { color: colors.text.primary }]}>{productionData.efficiency.toFixed(1)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statsColumn: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statIcon: {
    marginRight: 6,
  },
  statLabel: {
    fontSize: 13,
    width: 50,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    marginTop: 4,
  },
  efficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  efficiencyLabel: {
    fontSize: 13,
    width: 70,
  },
  efficiencyBarContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  efficiencyBar: {
    height: 6,
    borderRadius: 3,
  },
  efficiencyValue: {
    fontSize: 13,
    fontWeight: '500',
    width: 45,
    textAlign: 'right',
  },
});