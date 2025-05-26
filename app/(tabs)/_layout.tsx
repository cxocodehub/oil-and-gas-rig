import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Activity, Bell, Settings, BarChart3, Droplet, DollarSign, RefreshCw } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

export default function TabLayout() {
  const { colors } = useThemeStore();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.secondary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.background.secondary,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        headerTintColor: colors.secondary.main,
      }}
    >
      {/* Prioritize the three main tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="oil-price"
        options={{
          title: "Oil Price",
          tabBarIcon: ({ color }) => <DollarSign size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="currency"
        options={{
          title: "Currency",
          tabBarIcon: ({ color }) => <RefreshCw size={22} color={color} />,
        }}
      />
      
      {/* Move other tabs after the main three */}
      <Tabs.Screen
        name="equipment"
        options={{
          title: "Equipment",
          tabBarIcon: ({ color }) => <Activity size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="drilling"
        options={{
          title: "Drilling",
          tabBarIcon: ({ color }) => <Droplet size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}