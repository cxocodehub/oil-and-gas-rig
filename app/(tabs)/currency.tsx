import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw, ArrowRight, Search, TrendingUp, TrendingDown } from 'lucide-react-native';

// Define types for currency data
interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  flag: string;
}

export default function CurrencyScreen() {
  const { colors } = useThemeStore();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock currency data
  const currencies: CurrencyRate[] = [
    { code: 'USD', name: 'US Dollar', rate: 1, change: 0, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', rate: 0.92, change: 0.002, flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', rate: 0.78, change: -0.003, flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', rate: 149.82, change: 0.45, flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', rate: 1.36, change: -0.01, flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', rate: 1.52, change: 0.008, flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', rate: 0.89, change: 0.001, flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', rate: 7.24, change: -0.02, flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', rate: 83.45, change: 0.15, flag: '🇮🇳' },
    { code: 'RUB', name: 'Russian Ruble', rate: 92.67, change: 0.32, flag: '🇷🇺' },
    { code: 'SGD', name: 'Singapore Dollar', rate: 1.34, change: -0.005, flag: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', rate: 7.81, change: 0.01, flag: '🇭🇰' },
    { code: 'KRW', name: 'South Korean Won', rate: 1345.78, change: 2.34, flag: '🇰🇷' },
    { code: 'MXN', name: 'Mexican Peso', rate: 16.82, change: -0.08, flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', rate: 5.17, change: 0.03, flag: '🇧🇷' },
  ];
  
  // Filter currencies based on search query
  const filteredCurrencies = currencies.filter(currency => 
    currency.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    currency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate conversion
  const calculateConversion = () => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    const amountValue = parseFloat(amount) || 0;
    
    // Convert to USD first, then to target currency
    const result = (amountValue / fromRate) * toRate;
    return result.toFixed(4);
  };
  
  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  // Currency selection component
  const CurrencySelector = ({ 
    label, 
    value, 
    onSelect 
  }: { 
    label: string; 
    value: string; 
    onSelect: (code: string) => void; 
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedCurrency = currencies.find(c => c.code === value);
    
    return (
      <View style={styles.selectorContainer}>
        <Text style={[styles.selectorLabel, { color: colors.text.secondary }]}>{label}</Text>
        
        <TouchableOpacity 
          style={[styles.selectorButton, { backgroundColor: colors.background.card }]}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={[styles.currencyFlag, { marginRight: 8 }]}>{selectedCurrency?.flag}</Text>
          <Text style={[styles.currencyCode, { color: colors.text.primary }]}>{value}</Text>
          <Text style={[styles.currencyName, { color: colors.text.secondary }]}>
            {selectedCurrency?.name}
          </Text>
        </TouchableOpacity>
        
        {isOpen && (
          <View style={[styles.dropdownContainer, { backgroundColor: colors.background.card }]}>
            {currencies.map(currency => (
              <TouchableOpacity 
                key={currency.code}
                style={[
                  styles.dropdownItem,
                  currency.code === value && { backgroundColor: `${colors.secondary.main}20` }
                ]}
                onPress={() => {
                  onSelect(currency.code);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.currencyFlag}>{currency.flag}</Text>
                <Text style={[styles.currencyCode, { color: colors.text.primary }]}>
                  {currency.code}
                </Text>
                <Text style={[styles.currencyName, { color: colors.text.secondary }]}>
                  {currency.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Currency symbol components for background
  const CurrencySymbol = ({ symbol, style }: { symbol: string, style: any }) => (
    <Text style={[styles.currencySymbol, style]}>{symbol}</Text>
  );
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Currency symbols background */}
      <View style={styles.symbolsBackground}>
        <CurrencySymbol symbol="$" style={{ top: '5%', left: '10%', transform: [{ rotate: '-15deg' }] }} />
        <CurrencySymbol symbol="€" style={{ top: '15%', right: '15%', transform: [{ rotate: '10deg' }] }} />
        <CurrencySymbol symbol="£" style={{ top: '35%', left: '20%', transform: [{ rotate: '5deg' }] }} />
        <CurrencySymbol symbol="¥" style={{ top: '25%', right: '25%', transform: [{ rotate: '-8deg' }] }} />
        <CurrencySymbol symbol="₹" style={{ top: '45%', left: '15%', transform: [{ rotate: '12deg' }] }} />
        <CurrencySymbol symbol="₽" style={{ top: '55%', right: '10%', transform: [{ rotate: '-5deg' }] }} />
        <CurrencySymbol symbol="₩" style={{ top: '65%', left: '25%', transform: [{ rotate: '8deg' }] }} />
        <CurrencySymbol symbol="₿" style={{ top: '75%', right: '20%', transform: [{ rotate: '-10deg' }] }} />
      </View>

      <LinearGradient
        colors={['#F6E05E', '#F6AD55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <RefreshCw size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Currency Converter</Text>
            <Text style={styles.headerSubtitle}>Real-time exchange rates</Text>
          </View>
        </View>
      </LinearGradient>
      
      <View style={[styles.converterCard, { backgroundColor: colors.background.card }]}>
        <View style={styles.amountContainer}>
          <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>Amount</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text.primary, borderColor: colors.background.secondary }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        
        <View style={styles.currenciesContainer}>
          <CurrencySelector 
            label="From" 
            value={fromCurrency} 
            onSelect={setFromCurrency} 
          />
          
          <TouchableOpacity 
            style={[styles.swapButton, { backgroundColor: colors.secondary.main }]}
            onPress={handleSwapCurrencies}
          >
            <RefreshCw size={20} color={colors.neutral.white} />
          </TouchableOpacity>
          
          <CurrencySelector 
            label="To" 
            value={toCurrency} 
            onSelect={setToCurrency} 
          />
        </View>
        
        <View style={styles.resultContainer}>
          <View style={styles.resultRow}>
            <Text style={[styles.resultAmount, { color: colors.text.primary }]}>
              {amount} {fromCurrency}
            </Text>
            <ArrowRight size={20} color={colors.text.secondary} style={styles.resultArrow} />
            <Text style={[styles.resultAmount, { color: colors.text.primary }]}>
              {calculateConversion()} {toCurrency}
            </Text>
          </View>
          
          <Text style={[styles.resultRate, { color: colors.text.secondary }]}>
            1 {fromCurrency} = {(currencies.find(c => c.code === toCurrency)?.rate || 0) / 
                              (currencies.find(c => c.code === fromCurrency)?.rate || 1)} {toCurrency}
          </Text>
        </View>
      </View>
      
      <View style={styles.ratesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Exchange Rates</Text>
        
        <View style={[styles.searchContainer, { backgroundColor: colors.background.card }]}>
          <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search currency"
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        
        <View style={styles.ratesContainer}>
          {filteredCurrencies.map(currency => (
            <View 
              key={currency.code}
              style={[styles.rateCard, { backgroundColor: colors.background.card }]}
            >
              <View style={styles.rateCardLeft}>
                <Text style={styles.currencyFlag}>{currency.flag}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={[styles.currencyCode, { color: colors.text.primary }]}>
                    {currency.code}
                  </Text>
                  <Text style={[styles.currencyName, { color: colors.text.secondary }]}>
                    {currency.name}
                  </Text>
                </View>
              </View>
              
              <View style={styles.rateCardRight}>
                <Text style={[styles.rateValue, { color: colors.text.primary }]}>
                  {currency.rate.toFixed(4)}
                </Text>
                <View 
                  style={[
                    styles.rateChange,
                    { 
                      backgroundColor: currency.change >= 0 ? 
                        `${colors.status.success}20` : 
                        `${colors.status.danger}20` 
                    }
                  ]}
                >
                  {currency.change >= 0 ? (
                    <TrendingUp 
                      size={12} 
                      color={colors.status.success} 
                      style={styles.rateChangeIcon} 
                    />
                  ) : (
                    <TrendingDown 
                      size={12} 
                      color={colors.status.danger} 
                      style={styles.rateChangeIcon} 
                    />
                  )}
                  <Text 
                    style={[
                      styles.rateChangeText,
                      { 
                        color: currency.change >= 0 ? 
                          colors.status.success : 
                          colors.status.danger 
                      }
                    ]}
                  >
                    {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
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
  symbolsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  currencySymbol: {
    position: 'absolute',
    fontSize: 60,
    fontWeight: 'bold',
    opacity: 0.05,
    color: '#000000',
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
  converterCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  currenciesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectorContainer: {
    flex: 1,
    position: 'relative',
  },
  selectorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 24,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  currencyFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  currencyName: {
    fontSize: 14,
    flex: 1,
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultArrow: {
    marginHorizontal: 12,
  },
  resultRate: {
    fontSize: 14,
  },
  ratesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  ratesContainer: {
    marginBottom: 16,
  },
  rateCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  rateCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyInfo: {
    marginLeft: 8,
  },
  rateCardRight: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rateChange: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rateChangeIcon: {
    marginRight: 2,
  },
  rateChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});