import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

interface DataCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export default function DataCard({ title, value, icon, subtitle, trend, color }: DataCardProps) {
  const { colors } = useThemeStore();
  const cardColor = color || colors.secondary.main;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.secondary }]}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${cardColor}20` }]}>
          {icon}
        </View>
      </View>
      
      <Text style={[styles.value, { color: colors.text.primary }]}>{value}</Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
      )}
      
      {trend && (
        <View style={styles.trendContainer}>
          <View 
            style={[
              styles.trendIndicator, 
              { 
                backgroundColor: trend.isPositive ? 
                  `${colors.status.success}20` : 
                  `${colors.status.danger}20` 
              }
            ]}
          >
            <Text 
              style={[
                styles.trendValue, 
                { 
                  color: trend.isPositive ? 
                    colors.status.success : 
                    colors.status.danger 
                }
              ]}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
          </View>
          <Text style={[styles.trendPeriod, { color: colors.text.secondary }]}>vs last month</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: 150,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  trendPeriod: {
    fontSize: 12,
  },
});