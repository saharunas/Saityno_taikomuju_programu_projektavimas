// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { loadAccessTokenFromStorage } from "./api";
import { UserProvider, useUser } from "./context/UserContext"; // <-- svarbu

// Atskiras komponentas, kad galėtume naudoti useUser()
function AppStack() {
  const { isAdmin } = useUser();

  return (
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

      {/* Admin panel ekraną registruojam tik jei user’is Admin */}
      {isAdmin && (
        <Stack.Screen
          name="/pages/AdminPanel"
          options={{ title: "Admin panel" }}
        />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // užkraunam tokeną į axios / api instancą
      await loadAccessTokenFromStorage();
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    // simple splash kol susikrauna tokenas
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider theme={MD3LightTheme}>
      {/* visi ekranai turi prieigą prie user ir role per context */}
      <UserProvider>
        <AppStack />
      </UserProvider>
    </PaperProvider>
  );
}
