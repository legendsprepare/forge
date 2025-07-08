import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen"
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const theme = {
  colors: {
    primary: "#6B46C1",
    background: "#1a1a1a",
    surface: "#2a2a2a",
    text: "#ffffff",
    onPrimary: "#ffffff",
  },
};

export default function RootLayout() {
  useFrameworkReady();
  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        <StatusBar style="light" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
