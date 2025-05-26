import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

interface ChartDataPoint {
  value: number;
  timestamp: string;
}

interface LiveChartProps {
  title: string;
  data: ChartDataPoint[];
  unit: string;
  color?: string;
  minValue?: number;
  maxValue?: number;
  timeframe?: 'last-hour' | 'last-6-hours' | 'last-day';
}

export default function LiveChart({ 
  title, 
  data, 
  unit, 
  color, 
  minValue, 
  maxValue,
  timeframe = 'last-6-hours'
}: LiveChartProps) {
  const { colors } = useThemeStore();
  const chartColor = color || colors.secondary.main;
  const [dimensions, setDimensions] = useState({ width: Dimensions.get('window').width - 40 });
  
  // Filter data based on timeframe
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let cutoffTime: Date;
    
    switch (timeframe) {
      case 'last-hour':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
        break;
      case 'last-day':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
        break;
      case 'last-6-hours':
      default:
        cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours ago
        break;
    }
    
    return data.filter(point => new Date(point.timestamp) >= cutoffTime);
  };
  
  const filteredData = getFilteredData();
  
  // Calculate min and max values for the chart
  const calculateRange = () => {
    if (filteredData.length === 0) return { min: 0, max: 100 };
    
    let min = minValue !== undefined ? minValue : Math.min(...filteredData.map(d => d.value));
    let max = maxValue !== undefined ? maxValue : Math.max(...filteredData.map(d => d.value));
    
    // Add some padding to the range
    const padding = (max - min) * 0.1;
    min = Math.max(0, min - padding);
    max = max + padding;
    
    return { min, max };
  };
  
  const { min, max } = calculateRange();
  
  // Format timestamp for x-axis labels
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Generate x-axis labels
  const generateXLabels = () => {
    if (filteredData.length === 0) return [];
    
    const labelCount = 5; // Number of labels to show
    const step = Math.max(1, Math.floor(filteredData.length / (labelCount - 1)));
    const labels = [];
    
    for (let i = 0; i < filteredData.length; i += step) {
      if (labels.length < labelCount) {
        labels.push(formatTime(filteredData[i].timestamp));
      }
    }
    
    // Ensure we have the last point
    if (labels.length < labelCount && filteredData.length > 0) {
      const lastIndex = filteredData.length - 1;
      labels.push(formatTime(filteredData[lastIndex].timestamp));
    }
    
    return labels;
  };
  
  const xLabels = generateXLabels();
  
  // Generate y-axis labels
  const generateYLabels = () => {
    const labelCount = 5;
    const labels = [];
    const range = max - min;
    
    for (let i = 0; i < labelCount; i++) {
      const value = max - (range * i / (labelCount - 1));
      labels.push(value.toFixed(1));
    }
    
    return labels;
  };
  
  const yLabels = generateYLabels();
  
  // Calculate current value statistics
  const getCurrentStats = () => {
    if (filteredData.length === 0) return { current: 0, change: 0, isPositive: true };
    
    const current = filteredData[filteredData.length - 1].value;
    
    // Calculate change from first point in filtered data
    const first = filteredData[0].value;
    const change = current - first;
    const isPositive = change >= 0;
    
    return { current, change: Math.abs(change), isPositive };
  };
  
  const { current, change, isPositive } = getCurrentStats();
  
  return (
    <View 
      style={[styles.container, { backgroundColor: colors.background.card }]}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setDimensions({ width: width - 40 }); // Account for padding
      }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={[styles.currentValue, { color: chartColor }]}>
            {current.toFixed(1)} {unit}
          </Text>
          <View 
            style={[
              styles.changeIndicator, 
              { 
                backgroundColor: isPositive ? 
                  `${colors.status.success}20` : 
                  `${colors.status.danger}20` 
              }
            ]}
          >
            <Text 
              style={[
                styles.changeValue, 
                { 
                  color: isPositive ? 
                    colors.status.success : 
                    colors.status.danger 
                }
              ]}
            >
              {isPositive ? '+' : '-'}{change.toFixed(1)} {unit}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yLabelsContainer}>
          {yLabels.map((label, index) => (
            <Text 
              key={`y-${index}`} 
              style={[styles.axisLabel, { color: colors.text.secondary }]}
            >
              {label}
            </Text>
          ))}
        </View>
        
        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Grid lines */}
          {yLabels.map((_, index) => (
            <View 
              key={`grid-${index}`} 
              style={[
                styles.gridLine, 
                { borderTopColor: `${colors.text.secondary}20` }
              ]} 
            />
          ))}
          
          {/* Data line */}
          {filteredData.length > 1 && (
            <View style={styles.dataLineContainer}>
              {filteredData.map((point, index) => {
                if (index === 0) return null;
                
                const prevPoint = filteredData[index - 1];
                const x1 = ((index - 1) / (filteredData.length - 1)) * dimensions.width;
                const y1 = ((max - prevPoint.value) / (max - min)) * 200;
                const x2 = (index / (filteredData.length - 1)) * dimensions.width;
                const y2 = ((max - point.value) / (max - min)) * 200;
                
                // Calculate line length and angle for transform
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                
                return (
                  <View
                    key={`line-${index}`}
                    style={[
                      styles.dataLine,
                      {
                        width: length,
                        left: x1,
                        top: y1,
                        backgroundColor: chartColor,
                        transform: [
                          { rotate: `${angle}deg` },
                          { translateY: -1 } // Half the height of the line
                        ],
                        transformOrigin: 'left center',
                      }
                    ]}
                  />
                );
              })}
              
              {/* Data points */}
              {filteredData.map((point, index) => {
                const x = (index / (filteredData.length - 1)) * dimensions.width;
                const y = ((max - point.value) / (max - min)) * 200;
                
                return (
                  <View
                    key={`point-${index}`}
                    style={[
                      styles.dataPoint,
                      {
                        left: x - 3, // Half the width of the point
                        top: y - 3, // Half the height of the point
                        backgroundColor: chartColor,
                      }
                    ]}
                  />
                );
              })}
              
              {/* Area under the curve */}
              <LinearGradient
                colors={[`${chartColor}40`, `${chartColor}00`]}
                style={[
                  styles.areaGradient,
                  { width: dimensions.width }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <View style={styles.areaPath}>
                  {filteredData.map((point, index) => {
                    const x = (index / (filteredData.length - 1)) * dimensions.width;
                    const y = ((max - point.value) / (max - min)) * 200;
                    
                    return (
                      <View
                        key={`area-${index}`}
                        style={[
                          styles.areaPoint,
                          {
                            left: x,
                            top: y,
                          }
                        ]}
                      />
                    );
                  })}
                </View>
              </LinearGradient>
            </View>
          )}
        </View>
      </View>
      
      {/* X-axis labels */}
      <View style={styles.xLabelsContainer}>
        {xLabels.map((label, index) => (
          <Text 
            key={`x-${index}`} 
            style={[
              styles.axisLabel, 
              { color: colors.text.secondary },
              index === 0 ? { textAlign: 'left' } : 
              index === xLabels.length - 1 ? { textAlign: 'right' } : 
              { textAlign: 'center' }
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  changeIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changeValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 220,
    marginBottom: 8,
  },
  yLabelsContainer: {
    width: 40,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartArea: {
    flex: 1,
    height: 200,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    height: 0,
  },
  dataLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dataLine: {
    height: 2,
    position: 'absolute',
  },
  dataPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  areaGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 200,
  },
  areaPath: {
    flex: 1,
  },
  areaPoint: {
    position: 'absolute',
    width: 1,
    bottom: 0,
    top: 0,
  },
  xLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
  },
  axisLabel: {
    fontSize: 10,
    flex: 1,
  },
});