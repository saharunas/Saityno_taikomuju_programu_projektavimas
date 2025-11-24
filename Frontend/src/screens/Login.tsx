// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { api, setAccessToken } from "../api";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await api.post("/User/login", {
        username,
        password,
      });

      // Adjust this depending on how your backend responds
      const token = response.data.token || response.data.accessToken;

      if (!token) {
        Alert.alert("Login failed", "No token returned from server");
        return;
      }

      // Store token in memory (for now)
      setAccessToken(token);
      router.navigate("/home");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert("Login failed", "Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
