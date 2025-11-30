// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Toolbar from "@/app/components/Toolbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <View style={styles.container}>
      <Toolbar />

      {/* turinio sritis */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Saitynai</Text>
        <Text style={styles.subtitle}>
          Community platform for sharing posts, managing users and communities.
        </Text>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", // kitokia spalva nei footer/header
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563",
  },
  image: {
    marginTop: 16,
    width: "100%",
    height: 200,
  },
});
