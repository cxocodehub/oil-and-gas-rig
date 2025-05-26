import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRigStore } from '@/store/rigStore';
import AlertItem from '@/components/AlertItem';
import { Filter } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function AlertsScreen() {
  const { alerts, fetchStations, markAlertAsRead, isLoading } = useRigStore();
  const { colors } = useThemeStore();
  
  useEffect(() => {
    if (alerts.length === 0) {
      fetchStations();
    }
  }, []);
  
  // Group alerts by type
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical');
  const warningAlerts = alerts.filter(alert => alert.type === 'warning');
  const infoAlerts = alerts.filter(alert => alert.type === 'info');
  
  const handleAlertPress = (alertId: string) => {
    markAlertAsRead(alertId);
  };
  
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Notifications & Alerts</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.card }]}>
          <Filter size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.statsContainer, { backgroundColor: colors.background.card }]}>
        <LinearGradient
          colors={['#E53E3E', '#FC8181']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statItem}
        >
          <Text style={styles.statValue}>{criticalAlerts.length}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </LinearGradient>
        
        <View style={[styles.statDivider, { backgroundColor: colors.background.secondary }]} />
        
        <LinearGradient
          colors={['#ECC94B', '#F6E05E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statItem}
        >
          <Text style={styles.statValue}>{warningAlerts.length}</Text>
          <Text style={styles.statLabel}>Warnings</Text>
        </LinearGradient>
        
        <View style={[styles.statDivider, { backgroundColor: colors.background.secondary }]} />
        
        <LinearGradient
          colors={['#3182CE', '#63B3ED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statItem}
        >
          <Text style={styles.statValue}>{infoAlerts.length}</Text>
          <Text style={styles.statLabel}>Info</Text>
        </LinearGradient>
      </View>
      
      {criticalAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Critical</Text>
          {criticalAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onPress={() => handleAlertPress(alert.id)}
            />
          ))}
        </View>
      )}
      
      {warningAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Warnings</Text>
          {warningAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onPress={() => handleAlertPress(alert.id)}
            />
          ))}
        </View>
      )}
      
      {infoAlerts.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Information</Text>
          {infoAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onPress={() => handleAlertPress(alert.id)}
            />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});