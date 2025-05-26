import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { useRigStore } from '@/store/rigStore';
import { useDrillingStore } from '@/store/drillingStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Filter, TrendingUp, BarChart2 } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width - 40;

// Define types for chart data
interface ChartDataItem {
  day?: string;
  label?: string;
  value: number;
}

// Define types for chart component props
interface BarChartProps {
  data: ChartDataItem[];
  color?: string;
  height?: number;
  yAxisSuffix?: string;
}

interface LineChartProps {
  data: ChartDataItem[];
  color?: string;
  height?: number;
  bezier?: boolean;
  yAxisSuffix?: string;
}

export default function AnalyticsScreen() {
  const { colors } = useThemeStore();
  const { stations } = useRigStore();
  const { wells } = useDrillingStore();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  
  // Production data for charts
  const productionData: ChartDataItem[] = [
    { day: 'Mon', value: Math.round(Math.random() * 5000 + 15000) },
    { day: 'Tue', value: Math.round(Math.random() * 5000 + 15000) },
    { day: 'Wed', value: Math.round(Math.random() * 5000 + 15000) },
    { day: 'Thu', value: Math.round(Math.random() * 5000 + 15000) },
    { day: 'Fri', value: Math.round(Math.random() * 5000 + 15000) },
    { day: 'Sat', value: Math.round(Math.random() * 5000 + 15000) },
    { day: 'Sun', value: Math.round(Math.random() * 5000 + 15000) },
  ];
  
  // Efficiency data for charts
  const efficiencyData: ChartDataItem[] = [
    { day: 'Mon', value: Math.round(Math.random() * 10 + 85) },
    { day: 'Tue', value: Math.round(Math.random() * 10 + 85) },
    { day: 'Wed', value: Math.round(Math.random() * 10 + 85) },
    { day: 'Thu', value: Math.round(Math.random() * 10 + 85) },
    { day: 'Fri', value: Math.round(Math.random() * 10 + 85) },
    { day: 'Sat', value: Math.round(Math.random() * 10 + 85) },
    { day: 'Sun', value: Math.round(Math.random() * 10 + 85) },
  ];
  
  // Drilling progress data
  const drillingData: ChartDataItem[] = [
    { label: 'Well 1', value: Math.round(Math.random() * 20 + 70) },
    { label: 'Well 2', value: Math.round(Math.random() * 20 + 70) },
    { label: 'Well 3', value: Math.round(Math.random() * 20 + 70) },
    { label: 'Well 4', value: Math.round(Math.random() * 20 + 70) },
  ];
  
  // Equipment health data
  const equipmentHealthData: ChartDataItem[] = [
    { label: 'Pumps', value: Math.round(Math.random() * 15 + 80) },
    { label: 'Valves', value: Math.round(Math.random() * 15 + 80) },
    { label: 'Motors', value: Math.round(Math.random() * 15 + 80) },
    { label: 'Sensors', value: Math.round(Math.random() * 15 + 80) },
    { label: 'Controls', value: Math.round(Math.random() * 15 + 80) },
  ];
  
  // Simple bar chart component
  const SimpleBarChart = ({ data, color, height = 200, yAxisSuffix = '' }: BarChartProps) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <View style={{ height, width: '100%' }}>
        <View style={styles.chartContainer}>
          {data.map((item: ChartDataItem, index: number) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barLabelContainer}>
                <Text style={[styles.barLabel, { color: colors.text.secondary }]}>
                  {item.label || item.day}
                </Text>
              </View>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: color || colors.secondary.main
                    }
                  ]}
                />
              </View>
              <Text style={[styles.barValue, { color: colors.text.primary }]}>
                {item.value}{yAxisSuffix}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  // Simple line chart component
  const SimpleLineChart = ({ data, color, height = 200, bezier = true, yAxisSuffix = '' }: LineChartProps) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const range = maxValue - minValue;
    
    return (
      <View style={{ height, width: '100%' }}>
        <View style={styles.chartContainer}>
          {/* Draw lines between points */}
          <View style={styles.lineContainer}>
            {data.map((item: ChartDataItem, index: number) => {
              if (index === 0) return null;
              
              const prevItem = data[index - 1];
              const prevX = ((index - 1) / (data.length - 1)) * 100;
              const prevY = 100 - ((prevItem.value - minValue) / range) * 100;
              const currentX = (index / (data.length - 1)) * 100;
              const currentY = 100 - ((item.value - minValue) / range) * 100;
              
              return (
                <View 
                  key={`line-${index}`}
                  style={[
                    styles.line,
                    {
                      left: `${prevX}%`,
                      top: `${prevY}%`,
                      width: `${currentX - prevX}%`,
                      height: `${Math.abs(currentY - prevY)}%`,
                      transform: [
                        { translateY: currentY < prevY ? 0 : -Math.abs(currentY - prevY) }
                      ],
                      borderColor: color || colors.secondary.main
                    }
                  ]}
                />
              );
            })}
          </View>
          
          {/* Draw points */}
          {data.map((item: ChartDataItem, index: number) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            
            return (
              <View 
                key={`point-${index}`}
                style={[
                  styles.point,
                  {
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: color || colors.secondary.main
                  }
                ]}
              />
            );
          })}
          
          {/* X-axis labels */}
          <View style={styles.xAxisLabels}>
            {data.map((item: ChartDataItem, index: number) => (
              <Text 
                key={`label-${index}`}
                style={[
                  styles.xAxisLabel,
                  { color: colors.text.secondary }
                ]}
              >
                {item.day}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={['#F6E05E', '#F6AD55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Performance Analytics</Text>
        <Text style={styles.headerSubtitle}>Operational insights and trends</Text>
      </LinearGradient>
      
      <View style={styles.timeRangeSelector}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Time Range</Text>
        <View style={styles.timeRangeButtons}>
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              timeRange === 'day' && [styles.timeRangeButtonActive, { backgroundColor: colors.secondary.main }]
            ]}
            onPress={() => setTimeRange('day')}
          >
            <Text 
              style={[
                styles.timeRangeButtonText, 
                { color: colors.text.secondary },
                timeRange === 'day' && { color: colors.neutral.white }
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              timeRange === 'week' && [styles.timeRangeButtonActive, { backgroundColor: colors.secondary.main }]
            ]}
            onPress={() => setTimeRange('week')}
          >
            <Text 
              style={[
                styles.timeRangeButtonText, 
                { color: colors.text.secondary },
                timeRange === 'week' && { color: colors.neutral.white }
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              timeRange === 'month' && [styles.timeRangeButtonActive, { backgroundColor: colors.secondary.main }]
            ]}
            onPress={() => setTimeRange('month')}
          >
            <Text 
              style={[
                styles.timeRangeButtonText, 
                { color: colors.text.secondary },
                timeRange === 'month' && { color: colors.neutral.white }
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <TrendingUp size={20} color={colors.secondary.main} style={styles.chartIcon} />
            <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Oil Production</Text>
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.card }]}>
            <Filter size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.chartContainer, { backgroundColor: colors.background.card }]}>
          <SimpleLineChart 
            data={productionData} 
            color={colors.secondary.main}
            yAxisSuffix=" bbl/d"
          />
        </View>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <BarChart2 size={20} color={colors.accent.yellow} style={styles.chartIcon} />
            <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Operational Efficiency</Text>
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.card }]}>
            <Filter size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <LinearGradient
          colors={['#F6E05E', '#F6AD55']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.chartContainer, styles.gradientChartContainer]}
        >
          <View style={[styles.chartInnerContainer, { backgroundColor: colors.background.card }]}>
            <SimpleLineChart 
              data={efficiencyData} 
              color="#EC4899"
              yAxisSuffix="%"
            />
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <TrendingUp size={20} color={colors.secondary.main} style={styles.chartIcon} />
            <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Drilling Progress</Text>
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.card }]}>
            <Filter size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.chartContainer, { backgroundColor: colors.background.card }]}>
          <SimpleBarChart 
            data={drillingData} 
            color={colors.secondary.main}
            yAxisSuffix="%"
          />
        </View>
      </View>
      
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <BarChart2 size={20} color="#EC4899" style={styles.chartIcon} />
            <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Equipment Health</Text>
          </View>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.card }]}>
            <Filter size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <LinearGradient
          colors={['#EC4899', '#D53F8C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.chartContainer, styles.gradientChartContainer]}
        >
          <View style={[styles.chartInnerContainer, { backgroundColor: colors.background.card }]}>
            <SimpleBarChart 
              data={equipmentHealthData} 
              color="#EC4899"
              yAxisSuffix="%"
            />
          </View>
        </LinearGradient>
      </View>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeRangeSelector: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    backgroundColor: '#1A2234',
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: '#00A9A5',
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chartSection: {
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    marginRight: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 250,
  },
  gradientChartContainer: {
    padding: 2,
  },
  chartInnerContainer: {
    borderRadius: 10,
    padding: 16,
    flex: 1,
  },
  // Custom chart styles
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  barWrapper: {
    width: '60%',
    height: '80%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabelContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 10,
    marginTop: 4,
  },
  lineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
  },
  line: {
    position: 'absolute',
    borderBottomWidth: 2,
  },
  point: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginTop: -4,
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xAxisLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
});