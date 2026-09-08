import { Stack } from "expo-router";
import React, { useContext } from "react";
import {
  PaperProvider,
  ActivityIndicator,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";
import { HabitsProvider, HabitsContext } from "../context/HabitsContext";
import { View, useColorScheme } from "react-native";

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function AppContent() {
  const { isLoading } = useContext(HabitsContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="contact"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="donate"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="manual"
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <HabitsProvider>
      <PaperProvider theme={theme}>
        <AppContent />
      </PaperProvider>
    </HabitsProvider>
  );
}
