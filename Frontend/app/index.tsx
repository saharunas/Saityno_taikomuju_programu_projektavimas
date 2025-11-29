import React, { useEffect, useState } from "react";
import { Button, SafeAreaView, View, ActivityIndicator } from "react-native";
import LoginScreen from "./pages/Login";
import HomeScreen from "./pages/Home";
import RegisterScreen from "@/app/pages/Register";
import { Link } from "expo-router";
import { api, getAccessToken, setAccessToken } from "@/app/api";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true); // 👈 NEW

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/User/accessToken");
        const token = res.data.token || res.data.accessToken;
        console.log("Refreshed token:" + token);

        if (token) {
          await setAccessToken(token);
          setLoggedIn(true);
        } else {
          await setAccessToken(null);
          setLoggedIn(false);
        }
      } catch (e) {
        // no valid refresh token or error
        await setAccessToken(null);
        setLoggedIn(false);
      } finally {
        // ✅ now we know auth state for sure
        setAuthChecking(false);
      }
    };

    initAuth();
  }, []);

  if (authChecking) {
    // 👇 Here you can show a splash or just a spinner
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <PaperProvider>
      {!loggedIn ? (
        <>
          <LoginScreen />
        </>
      ) : (
        <HomeScreen />
      )}
    </PaperProvider>
  );
}
