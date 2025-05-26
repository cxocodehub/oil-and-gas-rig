import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useDrillingStore } from '@/store/drillingStore';
import { useThemeStore } from '@/store/themeStore';
import WellStatusCard from '@/components/drilling/WellStatusCard';
import ParameterCard from '@/components/drilling/ParameterCard';
import { Clock, Filter } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DrillingScreen() {
  const { 
    wells, 
    fetchWells, 
    updateWellData,
    isLoading 
  } = useDrillingStore();
  
  const { colors } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchWells();
    
    // Set up interval for real-time data updates
    const updateInterval = setInterval(() => {
      updateWellData();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(updateInterval);
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWells();
    setRefreshing(false);
  };
  
  // Get active drilling wells
  const drillingWells = wells.filter(well => well.status === 'drilling');
  const otherWells = wells.filter(well => well.status !== 'drilling');
  
  // Calculate summary data
  const totalDepth = wells.reduce((sum, well) => sum + well.currentDepth, 0);
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
        <Text style={styles.headerTitle}>Well Drilling Operations</Text>
        <Text style={styles.headerSubtitle}>Real-time drilling parameters</Text>
      </LinearGradient>
      
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
              {wells.length}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
              Active Wells
            </Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
              {totalDepth.toFixed(0)} m
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
              Total Depth
            </Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.summaryContent}>
            <Text style={[styles.summaryValue, { color: colors.text.primary }]}>
              {avgROP.toFixed(1)} m/hr
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
              Avg. ROP
            </Text>
          </View>
        </View>
      </View>
      
      {drillingWells.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Currently Drilling</Text>
            <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.card }]}>
              <Filter size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {drillingWells.map(well => (
            <WellStatusCard key={well.wellId} well={well} />
          ))}
          
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Key Parameters</Text>
          
          <View style={styles.parametersContainer}>
            {drillingWells[0] && (
              <>
                <ParameterCard sensor={drillingWells[0].rop} title="Rate of Penetration" />
                <ParameterCard sensor={drillingWells[0].wob} title="Weight on Bit" />
                <ParameterCard sensor={drillingWells[0].torque} title="Torque" />
                <ParameterCard sensor={drillingWells[0].rpm} title="Rotary Speed" />
              </>
            )}
          </View>
        </>
      )}
      
      {otherWells.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Other Wells</Text>
          </View>
          
          {otherWells.map(well => (
            <WellStatusCard key={well.wellId} well={well} />
          ))}
        </>
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
  header: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parametersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
  },
});