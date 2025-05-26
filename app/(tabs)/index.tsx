import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useRigStore } from '@/store/rigStore';
import { useDrillingStore } from '@/store/drillingStore';
import StationOverviewCard from '@/components/StationOverviewCard';
import DataCard from '@/components/DataCard';
import AlertItem from '@/components/AlertItem';
import { Droplet, Wind, Activity, Users, AlertTriangle, Wrench } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const { 
    stations, 
    alerts, 
    maintenanceTasks,
    fetchStations, 
    updateSensorData,
    isLoading 
  } = useRigStore();
  
  const {
    wells,
    fetchWells,
    updateWellData
  } = useDrillingStore();
  
  const { colors } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchStations();
    fetchWells();
    
    // Set up interval for real-time data updates
    const updateInterval = setInterval(() => {
      updateSensorData();
      updateWellData();
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(updateInterval);
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStations(), fetchWells()]);
    setRefreshing(false);
  };
  
  // Calculate summary data
  const totalOilProduction = stations.reduce((sum, station) => 
    sum + station.productionData.oilProduction, 0);
  
  const totalGasProduction = stations.reduce((sum, station) => 
    sum + station.productionData.gasProduction, 0);
  
  const avgEfficiency = stations.length > 0 
    ? stations.reduce((sum, station) => sum + station.productionData.efficiency, 0) / stations.length
    : 0;
  
  const totalCrewOnsite = stations.reduce((sum, station) => 
    sum + station.crew.onsite, 0);
  
  const criticalAlerts = alerts.filter(alert => 
    alert.type === 'critical' && !alert.read).length;
  
  const equipmentInMaintenance = stations.reduce((sum, station) => 
    sum + station.equipment.filter(eq => eq.status === 'maintenance').length, 0);
  
  // Calculate drilling stats
  const drillingWells = wells.filter(well => well.status === 'drilling');
  const totalDrillingDepth = drillingWells.reduce((sum, well) => sum + well.currentDepth, 0);
  const avgROP = drillingWells.length > 0 
    ? drillingWells.reduce((sum, well) => sum + well.rop.value, 0) / drillingWells.length
    : 0;
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={colors.secondary.main}
          colors={[colors.secondary.main]}
        />
      }
    >
      <LinearGradient
        colors={[colors.gradient.primary[0], colors.gradient.primary[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=200&auto=format' }} 
            style={styles.rigImage}
            resizeMode="cover"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Oil & Gas RIGs</Text>
            <Text style={styles.headerSubtitle}>Real-time monitoring dashboard</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.cardsContainer}>
        <DataCard 
          title="Oil Production"
          value={`${Math.round(totalOilProduction).toLocaleString()} bbl/d`}
          icon={<Droplet size={18} color={colors.secondary.main} />}
          trend={{ value: 3.2, isPositive: true }}
        />
        
        <DataCard 
          title="Gas Production"
          value={`${Math.round(totalGasProduction).toLocaleString()} mcf/d`}
          icon={<Wind size={18} color={colors.secondary.main} />}
          trend={{ value: 1.8, isPositive: true }}
        />
      </View>
      
      <View style={styles.cardsContainer}>
        <DataCard 
          title="Avg. Efficiency"
          value={`${avgEfficiency.toFixed(1)}%`}
          icon={<Activity size={18} color={colors.secondary.main} />}
          trend={{ value: 0.5, isPositive: true }}
        />
        
        <DataCard 
          title="Crew Onsite"
          value={totalCrewOnsite}
          icon={<Users size={18} color={colors.secondary.main} />}
          subtitle="across all platforms"
        />
      </View>
      
      <View style={styles.cardsContainer}>
        <DataCard 
          title="Critical Alerts"
          value={criticalAlerts}
          icon={<AlertTriangle size={18} color={colors.status.danger} />}
          color={colors.status.danger}
        />
        
        <DataCard 
          title="Equipment in Maintenance"
          value={equipmentInMaintenance}
          icon={<Wrench size={18} color={colors.status.info} />}
          color={colors.status.info}
        />
      </View>
      
      {drillingWells.length > 0 && (
        <View style={styles.cardsContainer}>
          <DataCard 
            title="Drilling Depth"
            value={`${Math.round(totalDrillingDepth).toLocaleString()} m`}
            icon={<Droplet size={18} color={colors.secondary.main} />}
          />
          
          <DataCard 
            title="Avg. ROP"
            value={`${avgROP.toFixed(1)} m/hr`}
            icon={<Activity size={18} color={colors.secondary.main} />}
          />
        </View>
      )}
      
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Rig Stations</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>{stations.length} active stations</Text>
      </View>
      
      {stations.map(station => (
        <StationOverviewCard key={station.id} station={station} />
      ))}
      
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Alerts</Text>
        <TouchableOpacity>
          <Text style={[styles.viewAllText, { color: colors.secondary.main }]}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {alerts.slice(0, 3).map(alert => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
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
  header: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rigImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  viewAllText: {
    fontSize: 14,
  },
});