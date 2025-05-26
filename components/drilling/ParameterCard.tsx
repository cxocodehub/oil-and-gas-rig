import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrillingSensor } from '@/types/drilling';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

interface ParameterCardProps {
  sensor: DrillingSensor;
  title?: string;
  showTrend?: boolean;
}

export default function ParameterCard({ sensor, title, showTrend = true }: ParameterCardProps) {
  const { colors } = useThemeStore();
  const { value, unit, status, min, max, trend } = sensor;
  
  // Calculate percentage for gauge
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Determine color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'critical':
        return colors.status.danger;
      default:
        return colors.status.normal;
    }
  };
  
  const getGradientColors = () => {
    switch (status) {
      case 'normal':
        return [colors.status.success, '#68D391'] as [string, string];
      case 'warning':
        return [colors.status.warning, '#F6E05E'] as [string, string];
      case 'critical':
        return [colors.status.danger, '#FC8181'] as [string, string];
      default:
        return [colors.status.normal, colors.neutral.gray] as [string, string];
    }
  };
  
  const statusColor = getStatusColor();
  const gradientColors = getGradientColors();
  
  // Render mini trend chart if trend data is available
  const renderTrendChart = () => {
    if (!trend || trend.length < 2 || !showTrend) return null;
    
    // Find min and max values in trend data
    const trendMin = Math.min(...trend);
    const trendMax = Math.max(...trend);
    const range = trendMax - trendMin;
    
    return (
      <View style={styles.trendContainer}>
        {trend.map((value, index) => {
          // Calculate height percentage based on value
          const heightPercentage = range === 0 ? 50 : ((value - trendMin) / range) * 100;
          
          return (
            <View 
              key={index} 
              style={[
                styles.trendBar,
                { 
                  height: `${heightPercentage}%`,
                  backgroundColor: statusColor,
                  opacity: 0.3 + (0.7 * index / trend.length) // Fade in from left to right
                }
              ]} 
            />
          );
        })}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <Text style={[styles.title, { color: colors.text.secondary }]}>
        {title || sensor.name}
      </Text>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: statusColor }]}>
          {value.toFixed(1)}
        </Text>
        <Text style={[styles.unit, { color: colors.text.secondary }]}>
          {unit}
        </Text>
      </View>
      
      <View style={styles.gaugeContainer}>
        <View 
          style={[
            styles.gaugeBackground, 
            { backgroundColor: colors.background.secondary }
          ]} 
        />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gaugeFill, 
            { width: `${percentage}%` }
          ]} 
        />
      </View>
      
      <View style={styles.minMaxContainer}>
        <Text style={[styles.minMax, { color: colors.text.secondary }]}>{min}</Text>
        <Text style={[styles.minMax, { color: colors.text.secondary }]}>{max}</Text>
      </View>
      
      {renderTrendChart()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    margin: 6,
    flex: 1,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 4,
  },
  unit: {
    fontSize: 12,
  },
  gaugeContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  gaugeBackground: {
    height: 8,
    borderRadius: 4,
    width: '100%',
  },
  gaugeFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 8,
    borderRadius: 4,
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  minMax: {
    fontSize: 10,
  },
  trendContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  trendBar: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
  },
});