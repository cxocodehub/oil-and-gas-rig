import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { ChevronRight, Bell, Clock, Shield, Wifi, Moon, HelpCircle, LogOut } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const [autoUpdateEnabled, setAutoUpdateEnabled] = React.useState(true);
  
  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    hasSwitch = false, 
    switchValue = false,
    onSwitchChange,
    onPress
  }: { 
    icon: React.ReactNode;
    title: string;
    description?: string;
    hasSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={hasSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.background.secondary, true: `${colors.secondary.main}80` }}
          thumbColor={switchValue ? colors.secondary.main : colors.neutral.gray}
        />
      ) : (
        <ChevronRight size={20} color={colors.text.secondary} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[colors.gradient.primary[0], colors.gradient.primary[1]] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileSection}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>JD</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileRole}>Senior Engineer</Text>
        </View>
      </LinearGradient>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <SettingItem
          icon={<Bell size={20} color={colors.secondary.main} />}
          title="Notifications"
          description="Receive alerts and updates"
          hasSwitch
          switchValue={notificationsEnabled}
          onSwitchChange={setNotificationsEnabled}
        />
        
        <SettingItem
          icon={<Moon size={20} color={colors.secondary.main} />}
          title="Dark Mode"
          description="Use dark theme"
          hasSwitch
          switchValue={isDarkMode}
          onSwitchChange={toggleTheme}
        />
        
        <SettingItem
          icon={<Clock size={20} color={colors.secondary.main} />}
          title="Auto-Update Interval"
          description="10 seconds"
          onPress={() => {}}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System</Text>
        
        <SettingItem
          icon={<Wifi size={20} color={colors.secondary.main} />}
          title="Data Synchronization"
          description="Auto-sync when connected"
          hasSwitch
          switchValue={autoUpdateEnabled}
          onSwitchChange={setAutoUpdateEnabled}
        />
        
        <SettingItem
          icon={<Shield size={20} color={colors.secondary.main} />}
          title="Security Settings"
          onPress={() => {}}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <SettingItem
          icon={<HelpCircle size={20} color={colors.secondary.main} />}
          title="Help & Documentation"
          onPress={() => {}}
        />
        
        <SettingItem
          icon={<LogOut size={20} color={colors.status.danger} />}
          title="Log Out"
          onPress={() => {}}
        />
      </View>
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2234',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 169, 165, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#A0AEC0',
  },
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    marginLeft: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});