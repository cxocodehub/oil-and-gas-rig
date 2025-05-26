import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormationData } from '@/types/drilling';
import { useThemeStore } from '@/store/themeStore';
import { Layers } from 'lucide-react-native';

interface FormationCardProps {
  data: FormationData;
}

export default function FormationCard({ data }: FormationCardProps) {
  const { colors } = useThemeStore();
  const { lithology, porosity, permeability, resistivity, gammaRay, density } = data;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.card }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.secondary.main}20` }]}>
          <Layers size={20} color={colors.secondary.main} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>Formation Data</Text>
      </View>
      
      <View style={[styles.lithologyContainer, { backgroundColor: colors.background.secondary }]}>
        <Text style={[styles.lithologyText, { color: colors.text.primary }]}>{lithology}</Text>
      </View>
      
      <View style={styles.dataGrid}>
        <View style={styles.dataItem}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Porosity</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{porosity.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Permeability</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{permeability.toFixed(1)} mD</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Resistivity</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{resistivity.toFixed(1)} Ω·m</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Gamma Ray</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{gammaRay.toFixed(1)} API</Text>
        </View>
        
        <View style={styles.dataItem}>
          <Text style={[styles.dataLabel, { color: colors.text.secondary }]}>Density</Text>
          <Text style={[styles.dataValue, { color: colors.text.primary }]}>{density.toFixed(2)} g/cm³</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  lithologyContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  lithologyText: {
    fontSize: 14,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  dataItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  dataLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});