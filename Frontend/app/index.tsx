import React, { useEffect, useState } from "react";
import { Button, SafeAreaView } from "react-native";
import LoginScreen from "../src/screens/Login";
import HomeScreen from "../src/screens/Home";
import RegisterScreen from "@/src/screens/Register";
import { Link, useRouter } from "expo-router";
import { api, getAccessToken, setAccessToken } from "@/src/api";

export default function Index() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {

      const initAuth = async () => {
      try {
        const res = await api.post("/User/accessToken"); // or /auth/refresh
        const token = res.data.token || res.data.accessToken;
        console.log("Refreshed token:" + token)
        if (token) {
          setAccessToken(token);
          setLoggedIn(true);
        }
      } catch {
        // no valid refresh token, stay logged out
        setAccessToken(null);
        setLoggedIn(false);
      }
    };

      const fetchData = async () => {
        console.log(api.defaults.headers.common["Authorization"]);
        console.log(getAccessToken());
      };
  
      initAuth();
      fetchData();
    }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
        {!loggedIn ? (
        <>
          <LoginScreen/>
            <Link href="/register" asChild>
              <Button title="Go to Register" onPress={() => {}} />
            </Link>
        </>
        ) : (
          <HomeScreen/>
        )}
      )
    </SafeAreaView>
  );
}
