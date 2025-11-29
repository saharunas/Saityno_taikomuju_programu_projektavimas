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
import Toolbar from "@/app/components/Toolbar";
import { layout } from "../styles/layout";
import { typography } from "../styles/typography";

export default function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      setLoading(true);

      const response = await api.post("/User/register", {
        name,
        surname,
        username,
        email,
        password,
      });

      router.navigate("/pages/Login");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert("Register failed", "Check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={layout.loginContainer}>
      <Text style={typography.title}>Register</Text>

      <TextInput
        style={layout.input}
        placeholder="Name"
        autoCapitalize="none"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={layout.input}
        placeholder="Surname"
        autoCapitalize="none"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        style={layout.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={layout.input}
        placeholder="Email"
        autoCapitalize="none"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={layout.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={layout.loginButton} onPress={handleRegister}>
        <Text style={layout.buttonText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
