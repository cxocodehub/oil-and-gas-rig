import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useDrillingStore } from '@/store/drillingStore';
import { useThemeStore } from '@/store/themeStore';
import StatusBadge from '@/components/StatusBadge';
import ParameterCard from '@/components/drilling/ParameterCard';
import LiveChart from '@/components/drilling/LiveChart';
import DirectionalView from '@/components/drilling/DirectionalView';
import FormationCard from '@/components/drilling/FormationCard';
import { Ruler, Clock, Target, ArrowLeft, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WellDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { wells, updateWellData, chartTimeframe, setChartTimeframe, selectedParameters, toggleParameter } = useDrillingStore();
  const { colors } = useThemeStore();
  const [showAllParameters, setShowAllParameters] = useState(false);
  
  // Find the well
  const well = wells.find(w => w.wellId === id);
  
  useEffect(() => {
    // Set up interval for real-time data updates
    const updateInterval = setInterval(() => {
      updateWellData();
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(updateInterval);
  }, []);
  
  if (!well) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Well not found</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.secondary.main }]} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.neutral.white }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Calculate completion percentage
  const completionPercentage = (well.currentDepth / well.targetDepth) * 100;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Convert log data to chart format
  const getChartData = (logData: { [key: string]: number[] | string[], depth: number[], timestamp: string[] }, key: string) => {
    if (!logData[key] || !Array.isArray(logData[key])) return [];
    
    return (logData[key] as number[]).map((value, index) => ({
      value,
      timestamp: logData.timestamp[index] as string
    }));
  };
  
  // Group parameters by category
  const drillingParams = [
    { key: 'rop', sensor: well.rop, title: 'Rate of Penetration' },
    { key: 'wob', sensor: well.wob, title: 'Weight on Bit' },
    { key: 'torque', sensor: well.torque, title: 'Torque' },
    { key: 'rpm', sensor: well.rpm, title: 'Rotary Speed' }
  ];
  
  const mudParams = [
    { key: 'mudFlowRate', sensor: well.mudFlowRate, title: 'Mud Flow Rate' },
    { key: 'mudDensity', sensor: well.mudDensity, title: 'Mud Density' },
    { key: 'mudTemperature', sensor: well.mudTemperature, title: 'Mud Temperature' },
    { key: 'mudViscosity', sensor: well.mudViscosity, title: 'Mud Viscosity' }
  ];
  
  const pressureParams = [
    { key: 'downholePressure', sensor: well.downholePressure, title: 'Downhole Pressure' },
    { key: 'annularPressure', sensor: well.annularPressure, title: 'Annular Pressure' },
    { key: 'standpipePressure', sensor: well.standpipePressure, title: 'Standpipe Pressure' },
    { key: 'casingPressure', sensor: well.casingPressure, title: 'Casing Pressure' }
  ];
  
  const mechanicalParams = [
    { key: 'hookLoad', sensor: well.hookLoad, title: 'Hook Load' },
    { key: 'blockPosition', sensor: well.blockPosition, title: 'Block Position' },
    { key: 'pumpRate', sensor: well.pumpRate, title: 'Pump Rate' }
  ];
  
  const vibrationParams = [
    { key: 'axialVibration', sensor: well.axialVibration, title: 'Axial Vibration' },
    { key: 'lateralVibration', sensor: well.lateralVibration, title: 'Lateral Vibration' },
    { key: 'torsionalVibration', sensor: well.torsionalVibration, title: 'Torsional Vibration' }
  ];
  
  const gasParams = [
    { key: 'methaneLevel', sensor: well.methaneLevel, title: 'Methane Level' },
    { key: 'hydrogenSulfideLevel', sensor: well.hydrogenSulfideLevel, title: 'H2S Level' }
  ];
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: well.wellName,
          headerBackTitle: 'Drilling',
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
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.wellName}>{well.wellName}</Text>
              <View style={styles.statusContainer}>
                <StatusBadge 
                  status={well.status === 'drilling' ? 'operational' : 
                         well.status === 'standby' ? 'warning' : 
                         well.status === 'complete' ? 'normal' : 'maintenance'} 
                  size="small" 
                />
                <Text style={styles.statusText}>{formatStatus(well.status)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completionPercentage.toFixed(1)}% complete
            </Text>
          </View>
        </LinearGradient>
        
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: colors.background.card }]}>
            <Ruler size={20} color={colors.secondary.main} style={styles.statsIcon} />
            <View>
              <Text style={[styles.statsValue, { color: colors.text.primary }]}>
                {well.currentDepth.toFixed(1)} m
              </Text>
              <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
                Current Depth
              </Text>
            </View>
          </View>
          
          <View style={[styles.statsCard, { backgroundColor: colors.background.card }]}>
            <Target size={20} color={colors.secondary.main} style={styles.statsIcon} />
            <View>
              <Text style={[styles.statsValue, { color: colors.text.primary }]}>
                {well.targetDepth.toFixed(0)} m
              </Text>
              <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
                Target Depth
              </Text>
            </View>
          </View>
          
          <View style={[styles.statsCard, { backgroundColor: colors.background.card }]}>
            <Clock size={20} color={colors.secondary.main} style={styles.statsIcon} />
            <View>
              <Text style={[styles.statsValue, { color: colors.text.primary }]}>
                {well.remainingTime.toFixed(0)} hrs
              </Text>
              <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>
                Remaining
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.timeframeSelector}>
          <Text style={[styles.timeframeSelectorLabel, { color: colors.text.primary }]}>Chart Timeframe:</Text>
          <View style={[styles.timeframeOptions, { backgroundColor: colors.background.card }]}>
            <TouchableOpacity 
              style={[
                styles.timeframeOption,
                chartTimeframe === 'last-hour' && [
                  styles.timeframeOptionActive,
                  { backgroundColor: colors.secondary.main }
                ]
              ]}
              onPress={() => setChartTimeframe('last-hour')}
            >
              <Text 
                style={[
                  styles.timeframeOptionText,
                  { color: colors.text.secondary },
                  chartTimeframe === 'last-hour' && [
                    styles.timeframeOptionTextActive,
                    { color: colors.neutral.white }
                  ]
                ]}
              >
                1h
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeframeOption,
                chartTimeframe === 'last-6-hours' && [
                  styles.timeframeOptionActive,
                  { backgroundColor: colors.secondary.main }
                ]
              ]}
              onPress={() => setChartTimeframe('last-6-hours')}
            >
              <Text 
                style={[
                  styles.timeframeOptionText,
                  { color: colors.text.secondary },
                  chartTimeframe === 'last-6-hours' && [
                    styles.timeframeOptionTextActive,
                    { color: colors.neutral.white }
                  ]
                ]}
              >
                6h
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeframeOption,
                chartTimeframe === 'last-day' && [
                  styles.timeframeOptionActive,
                  { backgroundColor: colors.secondary.main }
                ]
              ]}
              onPress={() => setChartTimeframe('last-day')}
            >
              <Text 
                style={[
                  styles.timeframeOptionText,
                  { color: colors.text.secondary },
                  chartTimeframe === 'last-day' && [
                    styles.timeframeOptionTextActive,
                    { color: colors.neutral.white }
                  ]
                ]}
              >
                24h
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Live Charts */}
        <LiveChart 
          title="Rate of Penetration (ROP)"
          data={getChartData(well.ropLog, 'rop')}
          unit="m/hr"
          color={colors.secondary.main}
          timeframe={chartTimeframe}
        />
        
        <LiveChart 
          title="Weight on Bit (WOB)"
          data={getChartData(well.wobLog, 'wob')}
          unit="tons"
          color={colors.accent.orange}
          timeframe={chartTimeframe}
        />
        
        <LiveChart 
          title="Torque"
          data={getChartData(well.torqueLog, 'torque')}
          unit="kN·m"
          color={colors.status.info}
          timeframe={chartTimeframe}
        />
        
        <LiveChart 
          title="Rotary Speed (RPM)"
          data={getChartData(well.rpmLog, 'rpm')}
          unit="RPM"
          color={colors.status.success}
          timeframe={chartTimeframe}
        />
        
        {/* Directional Data */}
        <DirectionalView data={well.directionalData} />
        
        {/* Formation Data */}
        <FormationCard data={well.formationData} />
        
        {/* Bit Information */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>Bit Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Type</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.bitType}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Size</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.bitSize}" diameter</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Total Footage</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.bitTotalFootage} m</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Hours</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.bitHours} hrs</Text>
            </View>
          </View>
        </View>
        
        {/* Drilling Fluid */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>Drilling Fluid</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Type</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.fluidType}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>pH</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.fluidPH}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Solids Content</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.fluidSolidsContent}%</Text>
            </View>
          </View>
        </View>
        
        {/* All Parameters Section */}
        <View style={styles.parametersSection}>
          <TouchableOpacity 
            style={styles.parametersSectionHeader}
            onPress={() => setShowAllParameters(!showAllParameters)}
          >
            <Text style={[styles.parametersSectionTitle, { color: colors.text.primary }]}>
              All Parameters
            </Text>
            <ChevronDown 
              size={20} 
              color={colors.text.primary} 
              style={{ transform: [{ rotate: showAllParameters ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          
          {showAllParameters && (
            <>
              <Text style={[styles.parameterGroupTitle, { color: colors.text.primary }]}>Drilling Parameters</Text>
              <View style={styles.parametersGrid}>
                {drillingParams.map(param => (
                  <ParameterCard key={param.key} sensor={param.sensor} title={param.title} />
                ))}
              </View>
              
              <Text style={[styles.parameterGroupTitle, { color: colors.text.primary }]}>Mud System</Text>
              <View style={styles.parametersGrid}>
                {mudParams.map(param => (
                  <ParameterCard key={param.key} sensor={param.sensor} title={param.title} />
                ))}
              </View>
              
              <Text style={[styles.parameterGroupTitle, { color: colors.text.primary }]}>Pressure Data</Text>
              <View style={styles.parametersGrid}>
                {pressureParams.map(param => (
                  <ParameterCard key={param.key} sensor={param.sensor} title={param.title} />
                ))}
              </View>
              
              <Text style={[styles.parameterGroupTitle, { color: colors.text.primary }]}>Mechanical Data</Text>
              <View style={styles.parametersGrid}>
                {mechanicalParams.map(param => (
                  <ParameterCard key={param.key} sensor={param.sensor} title={param.title} />
                ))}
              </View>
              
              <Text style={[styles.parameterGroupTitle, { color: colors.text.primary }]}>Vibration Data</Text>
              <View style={styles.parametersGrid}>
                {vibrationParams.map(param => (
                  <ParameterCard key={param.key} sensor={param.sensor} title={param.title} />
                ))}
              </View>
              
              <Text style={[styles.parameterGroupTitle, { color: colors.text.primary }]}>Gas Readings</Text>
              <View style={styles.parametersGrid}>
                {gasParams.map(param => (
                  <ParameterCard key={param.key} sensor={param.sensor} title={param.title} />
                ))}
              </View>
            </>
          )}
        </View>
        
        {/* Project Information */}
        <View style={[styles.infoCard, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.infoCardTitle, { color: colors.text.primary }]}>Project Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Start Date</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{formatDate(well.startDate)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Est. Completion</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{formatDate(well.estimatedCompletionDate)}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Elapsed Time</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.elapsedTime.toFixed(0)} hrs</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Remaining Time</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>{well.remainingTime.toFixed(0)} hrs</Text>
            </View>
          </View>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  wellName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 6,
  },
  progressContainer: {
    marginBottom: 4,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsIcon: {
    marginRight: 8,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
  },
  timeframeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeframeSelectorLabel: {
    fontSize: 14,
    marginRight: 12,
  },
  timeframeOptions: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  timeframeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  timeframeOptionActive: {
  },
  timeframeOptionText: {
    fontSize: 14,
  },
  timeframeOptionTextActive: {
    fontWeight: '500',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
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
  parametersSection: {
    marginBottom: 16,
  },
  parametersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  parametersSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  parameterGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 24,
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