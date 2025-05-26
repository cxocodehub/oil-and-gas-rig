import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useRigStore } from '@/store/rigStore';
import StatusBadge from '@/components/StatusBadge';
import EquipmentCard from '@/components/EquipmentCard';
import { MapPin, Users, Droplet, Wind, Thermometer, Activity, BarChart2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stations } = useRigStore();
  const { colors } = useThemeStore();
  
  // Find the station
  const station = stations.find(s => s.id === id);
  
  if (!station) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Station not found</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.secondary.main }]} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.neutral.white }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: station.name,
          headerBackTitle: 'Stations',
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background.primary }]} 
        contentContainerStyle={styles.contentContainer}
      >
        <LinearGradient
          colors={colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.stationName}>{station.name}</Text>
              <StatusBadge status={station.status} size="medium" />
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color="rgba(255, 255, 255, 0.8)" style={styles.locationIcon} />
              <Text style={styles.locationText}>{station.location.name}</Text>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.statsCards}>
          <View style={[styles.statsCard, { backgroundColor: colors.background.card }]}>
            <View style={[styles.statsIconContainer, { backgroundColor: `${colors.secondary.main}20` }]}>
              <Users size={20} color={colors.secondary.main} />
            </View>
            <View>
              <Text style={[styles.statsValue, { color: colors.text.primary }]}>{station.crew.onsite} / {station.crew.capacity}</Text>
              <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>Crew Onsite</Text>
            </View>
          </View>
          
          <View style={[styles.statsCard, { backgroundColor: colors.background.card }]}>
            <View style={[styles.statsIconContainer, { backgroundColor: `${colors.secondary.main}20` }]}>
              <Activity size={20} color={colors.secondary.main} />
            </View>
            <View>
              <Text style={[styles.statsValue, { color: colors.text.primary }]}>{station.productionData.efficiency.toFixed(1)}%</Text>
              <Text style={[styles.statsLabel, { color: colors.text.secondary }]}>Efficiency</Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Production Data</Text>
        
        <View style={[styles.productionCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.productionItem}>
            <Droplet size={20} color={colors.secondary.main} style={styles.productionIcon} />
            <View>
              <Text style={[styles.productionValue, { color: colors.text.primary }]}>{station.productionData.oilProduction.toFixed(0)}</Text>
              <Text style={[styles.productionLabel, { color: colors.text.secondary }]}>Oil (bbl/d)</Text>
            </View>
          </View>
          
          <View style={[styles.productionDivider, { backgroundColor: colors.background.secondary }]} />
          
          <View style={styles.productionItem}>
            <Wind size={20} color={colors.secondary.main} style={styles.productionIcon} />
            <View>
              <Text style={[styles.productionValue, { color: colors.text.primary }]}>{station.productionData.gasProduction.toFixed(0)}</Text>
              <Text style={[styles.productionLabel, { color: colors.text.secondary }]}>Gas (mcf/d)</Text>
            </View>
          </View>
          
          <View style={[styles.productionDivider, { backgroundColor: colors.background.secondary }]} />
          
          <View style={styles.productionItem}>
            <Droplet size={20} color={colors.secondary.main} style={styles.productionIcon} />
            <View>
              <Text style={[styles.productionValue, { color: colors.text.primary }]}>{station.productionData.waterProduction.toFixed(0)}</Text>
              <Text style={[styles.productionLabel, { color: colors.text.secondary }]}>Water (bbl/d)</Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Environmental Conditions</Text>
        
        <View style={[styles.environmentCard, { backgroundColor: colors.background.card }]}>
          <View style={styles.environmentRow}>
            <View style={styles.environmentItem}>
              <Wind size={18} color={colors.text.secondary} style={styles.environmentIcon} />
              <View>
                <Text style={[styles.environmentValue, { color: colors.text.primary }]}>{station.environmentalData.windSpeed.toFixed(1)} mph</Text>
                <Text style={[styles.environmentLabel, { color: colors.text.secondary }]}>Wind Speed</Text>
              </View>
            </View>
            
            <View style={styles.environmentItem}>
              <Thermometer size={18} color={colors.text.secondary} style={styles.environmentIcon} />
              <View>
                <Text style={[styles.environmentValue, { color: colors.text.primary }]}>{station.environmentalData.temperature.toFixed(1)} °C</Text>
                <Text style={[styles.environmentLabel, { color: colors.text.secondary }]}>Temperature</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.environmentRow}>
            <View style={styles.environmentItem}>
              <Droplet size={18} color={colors.text.secondary} style={styles.environmentIcon} />
              <View>
                <Text style={[styles.environmentValue, { color: colors.text.primary }]}>{station.environmentalData.humidity.toFixed(0)}%</Text>
                <Text style={[styles.environmentLabel, { color: colors.text.secondary }]}>Humidity</Text>
              </View>
            </View>
            
            <View style={styles.environmentItem}>
              <BarChart2 size={18} color={colors.text.secondary} style={styles.environmentIcon} />
              <View>
                <Text style={[styles.environmentValue, { color: colors.text.primary }]}>{station.environmentalData.pressure.toFixed(1)} hPa</Text>
                <Text style={[styles.environmentLabel, { color: colors.text.secondary }]}>Pressure</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.safetyContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Safety Status</Text>
          
          <View style={[styles.safetyCard, { backgroundColor: colors.background.card }]}>
            <View style={styles.safetyHeader}>
              <Text style={[styles.safetyTitle, { color: colors.text.primary }]}>Compliance Score</Text>
              <Text 
                style={[
                  styles.safetyScore,
                  { 
                    color: station.safetyStatus.complianceScore >= 90 ? colors.status.success :
                           station.safetyStatus.complianceScore >= 75 ? colors.status.warning :
                           colors.status.danger
                  }
                ]}
              >
                {station.safetyStatus.complianceScore.toFixed(1)}%
              </Text>
            </View>
            
            <View style={[styles.safetyProgressContainer, { backgroundColor: colors.background.secondary }]}>
              <LinearGradient
                colors={
                  station.safetyStatus.complianceScore >= 90 ? ['#38A169', '#68D391'] :
                  station.safetyStatus.complianceScore >= 75 ? ['#ECC94B', '#F6E05E'] :
                  ['#E53E3E', '#FC8181']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.safetyProgress,
                  { width: `${station.safetyStatus.complianceScore}%` }
                ]}
              />
            </View>
            
            <View style={styles.safetyItems}>
              <View style={styles.safetyItem}>
                <View 
                  style={[
                    styles.safetyIndicator,
                    { backgroundColor: station.safetyStatus.gasLeakDetection ? colors.status.danger : colors.status.success }
                  ]}
                />
                <Text style={[styles.safetyItemText, { color: colors.text.primary }]}>
                  Gas Leak Detection: {station.safetyStatus.gasLeakDetection ? 'Active' : 'Clear'}
                </Text>
              </View>
              
              <View style={styles.safetyItem}>
                <View 
                  style={[
                    styles.safetyIndicator,
                    { backgroundColor: station.safetyStatus.fireDetection ? colors.status.danger : colors.status.success }
                  ]}
                />
                <Text style={[styles.safetyItemText, { color: colors.text.primary }]}>
                  Fire Detection: {station.safetyStatus.fireDetection ? 'Active' : 'Clear'}
                </Text>
              </View>
              
              <View style={styles.safetyItem}>
                <View 
                  style={[
                    styles.safetyIndicator,
                    { backgroundColor: station.safetyStatus.emergencySystemsActive ? colors.status.warning : colors.status.success }
                  ]}
                />
                <Text style={[styles.safetyItemText, { color: colors.text.primary }]}>
                  Emergency Systems: {station.safetyStatus.emergencySystemsActive ? 'Active' : 'Standby'}
                </Text>
              </View>
            </View>
            
            <View style={[styles.inspectionInfo, { borderTopColor: colors.background.secondary }]}>
              <Text style={[styles.inspectionText, { color: colors.text.secondary }]}>
                Last inspection: {new Date(station.safetyStatus.lastInspection).toLocaleDateString()}
              </Text>
              <Text style={[styles.inspectionText, { color: colors.text.secondary }]}>
                Next inspection: {new Date(station.safetyStatus.nextInspection).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Equipment</Text>
        
        {station.equipment.map(equipment => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsCards: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productionItem: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  productionIcon: {
    marginRight: 8,
  },
  productionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  productionLabel: {
    fontSize: 12,
  },
  productionDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  environmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  environmentRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  environmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  environmentIcon: {
    marginRight: 8,
  },
  environmentValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  environmentLabel: {
    fontSize: 12,
  },
  safetyContainer: {
    marginBottom: 24,
  },
  safetyCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  safetyScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  safetyProgressContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  safetyProgress: {
    height: 8,
    borderRadius: 4,
  },
  safetyItems: {
    marginBottom: 16,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  safetyItemText: {
    fontSize: 14,
  },
  inspectionInfo: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  inspectionText: {
    fontSize: 13,
    marginBottom: 4,
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