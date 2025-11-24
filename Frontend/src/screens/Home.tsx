// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { api, getAccessToken, setAccessToken } from "../api";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example: GET /Users/me
        console.log(api.defaults.headers.common["Authorization"]);
        console.log(getAccessToken());
        const response = await api.get("/User");
        setMessage(JSON.stringify(response.data, null, 2));
      } catch (err: any) {
        console.log(err.response?.data || err.message);
        Alert.alert("Error", "Failed to fetch protected data");
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
        // Example: GET /Users/me
        console.log(api.defaults.headers.common["Authorization"]);
        console.log(getAccessToken());
        const response = await api.post("/User/logout");

      } catch (err: any) {
        setAccessToken(null);
        console.log(getAccessToken());
        console.log(err.response?.data || err.message);
        Alert.alert("Error", "Failed to logout");
      }
      finally{
        router.navigate("/login");
        setAccessToken(null);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logged in 🎉</Text>
      <Text style={styles.text}>{message}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 16, textAlign: "center" },
  text: { fontSize: 14, marginBottom: 16 },
});
