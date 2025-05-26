import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

type StatusType = 'operational' | 'maintenance' | 'offline' | 'warning' | 'critical' | 'normal';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const { colors } = useThemeStore();
  
  const getStatusColor = () => {
    switch (status) {
      case 'operational':
      case 'normal':
        return colors.status.success;
      case 'maintenance':
        return colors.status.info;
      case 'offline':
        return colors.neutral.gray;
      case 'warning':
        return colors.status.warning;
      case 'critical':
        return colors.status.danger;
      default:
        return colors.neutral.gray;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'maintenance':
        return 'Maintenance';
      case 'offline':
        return 'Offline';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'normal':
        return 'Normal';
      default:
        return 'Unknown';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 2, paddingHorizontal: 6 },
          text: { fontSize: 10 }
        };
      case 'large':
        return {
          container: { paddingVertical: 6, paddingHorizontal: 12 },
          text: { fontSize: 16 }
        };
      default:
        return {
          container: { paddingVertical: 4, paddingHorizontal: 8 },
          text: { fontSize: 12 }
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const statusColor = getStatusColor();
  const statusText = getStatusText();

  return (
    <View style={[
      styles.container, 
      { backgroundColor: `${statusColor}30` }, // 30% opacity
      sizeStyles.container
    ]}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <Text style={[styles.text, { color: statusColor }, sizeStyles.text]}>
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
});