// app/_layout.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { loadAccessTokenFromStorage } from "./api";
import { ActivityIndicator, View } from "react-native";
import { colors } from "./styles/colors";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

const localStack = createNativeStackNavigator();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadAccessTokenFromStorage();
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    // simple splash while we load the token
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="/pages/Login" options={{ title: "Login" }} />
        <Stack.Screen name="/pages/Register" options={{ title: "Register" }} />
        <Stack.Screen name="/pages/Home" options={{ title: "Home" }} />
        <Stack.Screen
          name="/pages/Communities"
          options={{ title: "All Communities" }}
        />
        <Stack.Screen
          name="/pages/Posts/[communityId]"
          options={{ title: "Posts" }}
        />
        <Stack.Screen
          name="/pages/Comments/[postId]"
          options={{ title: "Comments" }}
        />
      </Stack>
    </PaperProvider>
  );
}
