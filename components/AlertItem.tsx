import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react-native';
import { AlertNotification } from '@/types';
import { useThemeStore } from '@/store/themeStore';

interface AlertItemProps {
  alert: AlertNotification;
  onPress?: () => void;
}

export default function AlertItem({ alert, onPress }: AlertItemProps) {
  const { colors } = useThemeStore();
  const { title, message, type, timestamp, read } = alert;
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };
  
  // Get icon and color based on alert type
  const getAlertIcon = () => {
    switch (type) {
      case 'critical':
        return <AlertCircle size={22} color={colors.status.danger} />;
      case 'warning':
        return <AlertTriangle size={22} color={colors.status.warning} />;
      case 'info':
      default:
        return <Info size={22} color={colors.status.info} />;
    }
  };
  
  const getAlertColor = () => {
    switch (type) {
      case 'critical':
        return colors.status.danger;
      case 'warning':
        return colors.status.warning;
      case 'info':
      default:
        return colors.status.info;
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: colors.background.card },
        !read && { backgroundColor: `${getAlertColor()}10` }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getAlertIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
          <Text style={[styles.timestamp, { color: colors.text.secondary }]}>{formatRelativeTime(timestamp)}</Text>
        </View>
        
        <Text style={[styles.message, { color: colors.text.secondary }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
      
      {!read && <View style={[styles.unreadIndicator, { backgroundColor: getAlertColor() }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    alignSelf: 'center',
  },
});