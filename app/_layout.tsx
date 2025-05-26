import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/store/themeStore';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors, isDarkMode } = useThemeStore();
  
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootLayoutNav />
    </>
  );
}

function RootLayoutNav() {
  const { colors } = useThemeStore();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.secondary.main,
        headerTitleStyle: {
          color: colors.text.primary,
        },
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="equipment/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="station/[id]" options={{ headerShown: true }} />
    </Stack>
  );
}