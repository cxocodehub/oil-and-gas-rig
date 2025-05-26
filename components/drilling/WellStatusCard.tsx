import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WellDrillingData } from '@/types/drilling';
import StatusBadge from '@/components/StatusBadge';
import { useThemeStore } from '@/store/themeStore';
import { Ruler, Clock, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WellStatusCardProps {
  well: WellDrillingData;
}

export default function WellStatusCard({ well }: WellStatusCardProps) {
  const router = useRouter();
  const { colors } = useThemeStore();
  
  const handlePress = () => {
    router.push(`/drilling/${well.wellId}`);
  };
  
  // Calculate completion percentage
  const completionPercentage = (well.currentDepth / well.targetDepth) * 100;
  
  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.wellName, { color: colors.text.primary }]}>{well.wellName}</Text>
          <View style={styles.statusContainer}>
            <StatusBadge 
              status={well.status === 'drilling' ? 'operational' : 
                     well.status === 'standby' ? 'warning' : 
                     well.status === 'complete' ? 'normal' : 'maintenance'} 
              size="small" 
            />
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>
              {formatStatus(well.status)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: colors.background.secondary }]}>
          <LinearGradient
            colors={[colors.gradient.primary[0], colors.gradient.primary[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${completionPercentage}%` }]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.text.secondary }]}>
          {completionPercentage.toFixed(1)}% complete
        </Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ruler size={16} color={colors.secondary.main} style={styles.statIcon} />
          <View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {well.currentDepth.toFixed(1)} m
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Current Depth
            </Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Target size={16} color={colors.secondary.main} style={styles.statIcon} />
          <View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {well.targetDepth.toFixed(0)} m
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Target Depth
            </Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <Clock size={16} color={colors.secondary.main} style={styles.statIcon} />
          <View>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {well.remainingTime.toFixed(0)} hrs
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Remaining
            </Text>
          </View>
        </View>
      </View>
      
      {well.status === 'drilling' && (
        <View style={styles.drillingStats}>
          <View style={styles.drillingStatItem}>
            <Text style={[styles.drillingStatLabel, { color: colors.text.secondary }]}>
              ROP:
            </Text>
            <Text style={[styles.drillingStatValue, { color: colors.text.primary }]}>
              {well.rop.value.toFixed(1)} {well.rop.unit}
            </Text>
          </View>
          
          <View style={styles.drillingStatItem}>
            <Text style={[styles.drillingStatLabel, { color: colors.text.secondary }]}>
              WOB:
            </Text>
            <Text style={[styles.drillingStatValue, { color: colors.text.primary }]}>
              {well.wob.value.toFixed(1)} {well.wob.unit}
            </Text>
          </View>
          
          <View style={styles.drillingStatItem}>
            <Text style={[styles.drillingStatLabel, { color: colors.text.secondary }]}>
              RPM:
            </Text>
            <Text style={[styles.drillingStatValue, { color: colors.text.primary }]}>
              {well.rpm.value.toFixed(0)} {well.rpm.unit}
            </Text>
          </View>
        </View>
      )}
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
  wellName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    marginLeft: 6,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
  },
  drillingStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  drillingStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drillingStatLabel: {
    fontSize: 13,
    marginRight: 4,
  },
  drillingStatValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});