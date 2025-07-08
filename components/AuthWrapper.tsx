import React, { useEffect } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuthStore } from "../stores/authStore";
import { useRouter, useSegments } from "expo-router";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading, isGuest, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inProtectedGroup = segments[0] === "(app)";

    if (isLoading) {
      return;
    }

    if (!user && !isGuest && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace("/login");
    } else if ((user || isGuest) && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [user, isGuest, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  return <>{children}</>;
}
