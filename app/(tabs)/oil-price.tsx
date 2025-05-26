import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react-native';

// Define types for oil price data
interface OilPriceData {
  date: string;
  price: number;
  change: number;
  changePercent: number;
}

interface OilTypeData {
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  history: OilPriceData[];
}

export default function OilPriceScreen() {
  const { colors } = useThemeStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [selectedOilType, setSelectedOilType] = useState<string>('brent');
  
  // Mock data for oil prices
  const oilTypes: Record<string, OilTypeData> = {
    brent: {
      name: 'Brent Crude',
      currentPrice: 85.32,
      change: 1.24,
      changePercent: 1.47,
      history: generateMockPriceData(30, 85.32, 75, 90)
    },
    wti: {
      name: 'WTI Crude',
      currentPrice: 82.18,
      change: 0.87,
      changePercent: 1.07,
      history: generateMockPriceData(30, 82.18, 72, 88)
    },
    dubai: {
      name: 'Dubai Crude',
      currentPrice: 80.45,
      change: -0.32,
      changePercent: -0.40,
      history: generateMockPriceData(30, 80.45, 70, 85)
    },
    natural: {
      name: 'Natural Gas',
      currentPrice: 2.87,
      change: 0.05,
      changePercent: 1.77,
      history: generateMockPriceData(30, 2.87, 2.5, 3.2)
    }
  };
  
  // Function to generate mock price data
  function generateMockPriceData(days: number, currentPrice: number, min: number, max: number): OilPriceData[] {
    const data: OilPriceData[] = [];
    let price = currentPrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate a random price change within a reasonable range
      const change = (Math.random() * 2 - 1) * (max - min) / 20;
      
      // Ensure price stays within min-max range
      price = Math.max(min, Math.min(max, price + change));
      
      // Fix: Check if data array has elements before accessing them
      const changeValue = i > 0 && data.length > 0 ? price - data[data.length - 1].price : 0;
      const changePercent = i > 0 && data.length > 0 ? (changeValue / data[data.length - 1].price) * 100 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(changeValue.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2))
      });
    }
    
    return data;
  }
  
  // Get filtered data based on time range
  const getFilteredData = (data: OilPriceData[]) => {
    switch (timeRange) {
      case 'week':
        return data.slice(-7);
      case 'year':
        return data;
      case 'month':
      default:
        return data.slice(-30);
    }
  };
  
  const selectedOil = oilTypes[selectedOilType];
  const filteredData = getFilteredData(selectedOil.history);
  
  // Simple line chart component
  const SimpleLineChart = () => {
    const chartHeight = 200;
    const chartWidth = Dimensions.get('window').width - 64; // Account for padding
    
    // Find min and max values
    const prices = filteredData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    // Add some padding to the range
    const paddedMin = Math.max(0, minPrice - priceRange * 0.1);
    const paddedMax = maxPrice + priceRange * 0.1;
    const paddedRange = paddedMax - paddedMin;
    
    // Generate points for the line
    const points = filteredData.map((dataPoint, index) => {
      const x = (index / (filteredData.length - 1)) * chartWidth;
      const y = chartHeight - ((dataPoint.price - paddedMin) / paddedRange) * chartHeight;
      return { x, y };
    });
    
    // Generate path for the line
    const pathD = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    // Format date for x-axis labels
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Generate x-axis labels
    const xLabels = () => {
      if (filteredData.length <= 5) {
        return filteredData.map(d => formatDate(d.date));
      }
      
      const step = Math.ceil(filteredData.length / 5);
      const labels = [];
      
      for (let i = 0; i < filteredData.length; i += step) {
        if (labels.length < 5) {
          labels.push(formatDate(filteredData[i].date));
        }
      }
      
      // Ensure we have the last date
      if (labels.length < 5) {
        labels.push(formatDate(filteredData[filteredData.length - 1].date));
      }
      
      return labels;
    };
    
    // Generate y-axis labels
    const yLabels = () => {
      const labels = [];
      const step = paddedRange / 4;
      
      for (let i = 0; i < 5; i++) {
        labels.push((paddedMax - i * step).toFixed(2));
      }
      
      return labels;
    };
    
    return (
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yLabelsContainer}>
          {yLabels().map((label, index) => (
            <Text 
              key={`y-${index}`} 
              style={[styles.axisLabel, { color: colors.text.secondary }]}
            >
              ${label}
            </Text>
          ))}
        </View>
        
        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Grid lines */}
          {yLabels().map((_, index) => (
            <View 
              key={`grid-${index}`} 
              style={[
                styles.gridLine, 
                { borderTopColor: `${colors.text.secondary}20` }
              ]} 
            />
          ))}
          
          {/* Line */}
          <View style={styles.lineContainer}>
            {points.map((point, index) => {
              if (index === 0) return null;
              
              const prevPoint = points[index - 1];
              
              return (
                <View
                  key={`line-${index}`}
                  style={[
                    styles.line,
                    {
                      left: prevPoint.x,
                      top: prevPoint.y,
                      width: point.x - prevPoint.x,
                      height: Math.abs(point.y - prevPoint.y),
                      backgroundColor: selectedOil.change >= 0 ? colors.status.success : colors.status.danger,
                      transform: [
                        { translateY: point.y < prevPoint.y ? 0 : -Math.abs(point.y - prevPoint.y) }
                      ]
                    }
                  ]}
                />
              );
            })}
          </View>
          
          {/* Points */}
          {points.map((point, index) => (
            <View
              key={`point-${index}`}
              style={[
                styles.point,
                {
                  left: point.x - 3,
                  top: point.y - 3,
                  backgroundColor: selectedOil.change >= 0 ? colors.status.success : colors.status.danger
                }
              ]}
            />
          ))}
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
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <DollarSign size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Oil Price Monitor</Text>
            <Text style={styles.headerSubtitle}>Real-time global oil price tracking</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={styles.oilTypesContainer}>
        {Object.entries(oilTypes).map(([key, oil]) => (
          <TouchableOpacity 
            key={key}
            style={[
              styles.oilTypeButton,
              selectedOilType === key && [
                styles.oilTypeButtonActive,
                { backgroundColor: colors.secondary.main }
              ]
            ]}
            onPress={() => setSelectedOilType(key)}
          >
            <Text 
              style={[
                styles.oilTypeButtonText,
                { color: colors.text.secondary },
                selectedOilType === key && { color: colors.neutral.white }
              ]}
            >
              {oil.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={[styles.priceCard, { backgroundColor: colors.background.card }]}>
        <View style={styles.priceHeader}>
          <Text style={[styles.priceTitle, { color: colors.text.primary }]}>
            {selectedOil.name}
          </Text>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.text.secondary} style={styles.dateIcon} />
            <Text style={[styles.dateText, { color: colors.text.secondary }]}>
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </View>
        </View>
        
        <View style={styles.priceContent}>
          <Text style={[styles.priceValue, { color: colors.text.primary }]}>
            ${selectedOil.currentPrice.toFixed(2)}
          </Text>
          
          <View style={styles.changeContainer}>
            <View 
              style={[
                styles.changeIndicator,
                { 
                  backgroundColor: selectedOil.change >= 0 ? 
                    `${colors.status.success}20` : 
                    `${colors.status.danger}20` 
                }
              ]}
            >
              {selectedOil.change >= 0 ? (
                <TrendingUp 
                  size={14} 
                  color={colors.status.success} 
                  style={styles.changeIcon} 
                />
              ) : (
                <TrendingDown 
                  size={14} 
                  color={colors.status.danger} 
                  style={styles.changeIcon} 
                />
              )}
              <Text 
                style={[
                  styles.changeText,
                  { 
                    color: selectedOil.change >= 0 ? 
                      colors.status.success : 
                      colors.status.danger 
                  }
                ]}
              >
                {selectedOil.change >= 0 ? '+' : ''}{selectedOil.change.toFixed(2)} ({selectedOil.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.timeRangeSelector}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Time Range</Text>
        <View style={styles.timeRangeButtons}>
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
          
          <TouchableOpacity 
            style={[
              styles.timeRangeButton, 
              timeRange === 'year' && [styles.timeRangeButtonActive, { backgroundColor: colors.secondary.main }]
            ]}
            onPress={() => setTimeRange('year')}
          >
            <Text 
              style={[
                styles.timeRangeButtonText, 
                { color: colors.text.secondary },
                timeRange === 'year' && { color: colors.neutral.white }
              ]}
            >
              Year
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.chartCard, { backgroundColor: colors.background.card }]}>
        <View style={styles.chartHeader}>
          <Text style={[styles.chartTitle, { color: colors.text.primary }]}>Price Trend</Text>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.background.secondary }]}>
            <Filter size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <SimpleLineChart />
      </View>
      
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Price History</Text>
      
      <View style={[styles.historyCard, { backgroundColor: colors.background.card }]}>
        <View style={styles.historyHeader}>
          <Text style={[styles.historyHeaderText, { color: colors.text.secondary }]}>Date</Text>
          <Text style={[styles.historyHeaderText, { color: colors.text.secondary }]}>Price</Text>
          <Text style={[styles.historyHeaderText, { color: colors.text.secondary }]}>Change</Text>
        </View>
        
        {filteredData.slice(-10).reverse().map((dataPoint, index) => (
          <View key={index} style={styles.historyRow}>
            <Text style={[styles.historyDate, { color: colors.text.primary }]}>
              {new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
            <Text style={[styles.historyPrice, { color: colors.text.primary }]}>
              ${dataPoint.price.toFixed(2)}
            </Text>
            <Text 
              style={[
                styles.historyChange,
                { 
                  color: dataPoint.change >= 0 ? 
                    colors.status.success : 
                    colors.status.danger 
                }
              ]}
            >
              {dataPoint.change >= 0 ? '+' : ''}{dataPoint.change.toFixed(2)} ({dataPoint.changePercent.toFixed(2)}%)
            </Text>
          </View>
        ))}
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
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
  oilTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    marginHorizontal: -4,
  },
  oilTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#1A2234',
  },
  oilTypeButtonActive: {
    backgroundColor: '#00A9A5',
  },
  oilTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 12,
  },
  priceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  changeIcon: {
    marginRight: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
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
  chartCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    flexDirection: 'row',
    height: 220,
  },
  yLabelsContainer: {
    width: 60,
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
  lineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  line: {
    height: 2,
    position: 'absolute',
  },
  point: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  axisLabel: {
    fontSize: 10,
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  historyHeaderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  historyDate: {
    flex: 1,
    fontSize: 14,
  },
  historyPrice: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  historyChange: {
    flex: 1.5,
    fontSize: 14,
    textAlign: 'right',
  },
});