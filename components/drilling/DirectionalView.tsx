import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DirectionalData } from '@/types/drilling';
import { useThemeStore } from '@/store/themeStore';
import { Compass, ArrowUp } from 'lucide-react-native';

interface DirectionalViewProps {
  data: DirectionalData;
}

export default function DirectionalView({ data }: DirectionalViewProps) {
  const { colors } = useThemeStore();
  const { inclination, azimuth, toolFace, northSouth, eastWest } = data;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>Directional Data</Text>
      
      <View style={styles.compassContainer}>
        <View style={[styles.compass, { borderColor: colors.text.secondary }]}>
          <View style={[styles.compassCenter, { backgroundColor: colors.background.secondary }]} />
          
          {/* North indicator */}
          <Text style={[styles.compassDirection, { color: colors.text.primary, top: 5, left: '47%' }]}>N</Text>
          <Text style={[styles.compassDirection, { color: colors.text.primary, bottom: 5, left: '47%' }]}>S</Text>
          <Text style={[styles.compassDirection, { color: colors.text.primary, left: 5, top: '47%' }]}>W</Text>
          <Text style={[styles.compassDirection, { color: colors.text.primary, right: 5, top: '47%' }]}>E</Text>
          
          {/* Azimuth indicator */}
          <View 
            style={[
              styles.azimuthIndicator, 
              { 
                backgroundColor: colors.secondary.main,
                transform: [
                  { rotate: `${azimuth}deg` }
                ]
              }
            ]} 
          />
          
          {/* Inclination indicator */}
          <View style={styles.inclinationContainer}>
            <Text style={[styles.inclinationValue, { color: colors.text.primary }]}>
              {inclination.toFixed(1)}°
            </Text>
            <ArrowUp 
              size={16} 
              color={colors.secondary.main} 
              style={{ 
                transform: [
                  { rotate: `${inclination}deg` }
                ]
              }} 
            />
          </View>
        </View>
      </View>
      
      <View style={styles.dataContainer}>
        <View style={styles.dataRow}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Azimuth:</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{azimuth.toFixed(1)}°</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Inclination:</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{inclination.toFixed(1)}°</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Tool Face:</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{toolFace.toFixed(1)}°</Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>North/South:</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>
            {northSouth >= 0 ? 'N' : 'S'} {Math.abs(northSouth).toFixed(1)} m
          </Text>
        </View>
        
        <View style={styles.dataRow}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>East/West:</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>
            {eastWest >= 0 ? 'E' : 'W'} {Math.abs(eastWest).toFixed(1)} m
          </Text>
        </View>
      </View>
    </View>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  compassContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  compass: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compassDirection: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
  azimuthIndicator: {
    position: 'absolute',
    width: 2,
    height: 50,
    bottom: '50%',
    left: '50%',
    marginLeft: -1,
    transformOrigin: 'bottom center',
  },
  inclinationContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  inclinationValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataContainer: {
    marginTop: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});