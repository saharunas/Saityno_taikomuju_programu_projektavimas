import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { api, setAccessToken } from "../api";
import { useRouter } from "expo-router";
import { layout } from "../styles/layout";
import { typography } from "../styles/typography";

export default function Login() {
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
      router.navigate("/pages/Home");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert("Login failed", "Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layout.loginContainer}>
      <Text style={typography.title}>Login</Text>

      <TextInput
        style={layout.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={layout.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={layout.loginButton} onPress={handleLogin}>
        <Text style={layout.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={layout.loginButton}
        onPress={() => router.navigate("/pages/Register")}
      >
        <Text style={layout.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
