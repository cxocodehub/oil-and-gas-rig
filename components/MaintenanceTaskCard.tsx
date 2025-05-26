import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { MaintenanceTask } from '@/types';
import colors from '@/constants/colors';

interface MaintenanceTaskCardProps {
  task: MaintenanceTask;
  onPress?: () => void;
}

export default function MaintenanceTaskCard({ task, onPress }: MaintenanceTaskCardProps) {
  const { title, description, priority, status, scheduledDate, estimatedDuration, assignedTo } = task;
  
  // Get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case 'critical':
        return colors.status.danger;
      case 'high':
        return colors.accent.orange;
      case 'medium':
        return colors.status.warning;
      case 'low':
      default:
        return colors.status.info;
    }
  };
  
  // Get status color and text
  const getStatusInfo = () => {
    switch (status) {
      case 'completed':
        return { color: colors.status.success, text: 'Completed' };
      case 'in-progress':
        return { color: colors.status.info, text: 'In Progress' };
      case 'delayed':
        return { color: colors.status.warning, text: 'Delayed' };
      case 'scheduled':
      default:
        return { color: colors.neutral.gray, text: 'Scheduled' };
    }
  };
  
  const statusInfo = getStatusInfo();
  const priorityColor = getPriorityColor();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Calendar size={16} color={colors.text.secondary} style={styles.infoIcon} />
          <Text style={styles.infoText}>{formatDate(scheduledDate)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Clock size={16} color={colors.text.secondary} style={styles.infoIcon} />
          <Text style={styles.infoText}>{estimatedDuration} hours</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.assigneeContainer}>
        <Text style={styles.assigneeLabel}>Assigned to:</Text>
        <Text style={styles.assigneeText}>
          {assignedTo.length > 2 
            ? `${assignedTo[0]}, ${assignedTo[1]} +${assignedTo.length - 2}`
            : assignedTo.join(', ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background.secondary,
    marginBottom: 12,
  },
  assigneeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigneeLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginRight: 6,
  },
  assigneeText: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '500',
  },
});