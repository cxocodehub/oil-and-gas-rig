import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SensorData } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

interface SensorGaugeProps {
  sensor: SensorData;
  size?: 'small' | 'medium' | 'large';
}

export default function SensorGauge({ sensor, size = 'medium' }: SensorGaugeProps) {
  const { colors } = useThemeStore();
  const { value, min, max, unit, status, name } = sensor;
  
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
        return [colors.status.success, '#68D391'];
      case 'warning':
        return [colors.status.warning, '#F6E05E'];
      case 'critical':
        return [colors.status.danger, '#FC8181'];
      default:
        return [colors.status.normal, colors.neutral.gray];
    }
  };
  
  const statusColor = getStatusColor();
  const gradientColors = getGradientColors();
  
  // Size adjustments
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 120, height: 80 },
          title: { fontSize: 12 },
          value: { fontSize: 16 },
          unit: { fontSize: 10 },
          gauge: { height: 6 },
          minMax: { fontSize: 9 },
        };
      case 'large':
        return {
          container: { width: 220, height: 140 },
          title: { fontSize: 16 },
          value: { fontSize: 28 },
          unit: { fontSize: 14 },
          gauge: { height: 10 },
          minMax: { fontSize: 12 },
        };
      default:
        return {
          container: { width: 160, height: 100 },
          title: { fontSize: 14 },
          value: { fontSize: 22 },
          unit: { fontSize: 12 },
          gauge: { height: 8 },
          minMax: { fontSize: 10 },
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  
  return (
    <View style={[
      styles.container, 
      sizeStyles.container, 
      { backgroundColor: colors.background.card }
    ]}>
      <Text style={[
        styles.title, 
        sizeStyles.title, 
        { color: colors.text.secondary }
      ]}>{name}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={[
          styles.value, 
          { color: statusColor }, 
          sizeStyles.value
        ]}>
          {value.toFixed(1)}
        </Text>
        <Text style={[
          styles.unit, 
          sizeStyles.unit, 
          { color: colors.text.secondary }
        ]}>{unit}</Text>
      </View>
      
      <View style={styles.gaugeContainer}>
        <View style={[
          styles.gaugeBackground, 
          sizeStyles.gauge, 
          { backgroundColor: colors.background.secondary }
        ]} />
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gaugeFill, 
            { width: `${percentage}%` },
            sizeStyles.gauge
          ]} 
        />
      </View>
      
      <View style={styles.minMaxContainer}>
        <Text style={[
          styles.minMax, 
          sizeStyles.minMax, 
          { color: colors.text.secondary }
        ]}>{min}</Text>
        <Text style={[
          styles.minMax, 
          sizeStyles.minMax, 
          { color: colors.text.secondary }
        ]}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  value: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  unit: {
  },
  gaugeContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  gaugeBackground: {
    borderRadius: 4,
    width: '100%',
  },
  gaugeFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 4,
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minMax: {
  },
});