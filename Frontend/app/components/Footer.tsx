// src/components/Footer.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BREAKPOINT = 768;

export default function Footer() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;

  const navigate = (path: string) => {
    router.navigate(path as any);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.content,
          { flexDirection: isDesktop ? "row" : "column" },
        ]}
      >
        {/* Kairė: brand / aprašymas */}
        <View style={[styles.section, { flex: 2 }]}>
          <Text style={styles.logo}>Saitynai</Text>
          <Text style={styles.text}>
            Community platform for sharing posts, managing users and
            communities.
          </Text>
        </View>

        {/* Vidurys: navigacija */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <TouchableOpacity onPress={() => navigate("/pages/Home")}>
            <Text style={styles.link}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("/pages/Communities")}>
            <Text style={styles.link}>Communities</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate("/pages/Admin")}>
            <Text style={styles.link}>Admin panel</Text>
          </TouchableOpacity>
        </View>

        {/* Dešinė: kontaktai / social */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.text}>support@saitynai.lt</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity>
              <Ionicons name="logo-github" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="mail-outline" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="logo-facebook" size={20} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* apatinė juosta */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>
          © 2025 Saitynai. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#111827", // tamsus fonas, skiriasi nuo header
    paddingTop: 16,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    justifyContent: "space-between",
    fontFamily: "math",
  },
  section: {
    marginBottom: 12,
  },
  logo: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "math",
  },
  text: {
    color: "#9CA3AF",
    fontSize: 14,
    fontFamily: "math",
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    fontFamily: "math",
  },
  link: {
    color: "#93C5FD",
    fontSize: 14,
    marginBottom: 2,
    fontFamily: "math",
  },
  socialRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  icon: {
    color: "#E5E7EB",
    marginRight: 12,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#1F2933",
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  bottomText: {
    color: "#6B7280",
    fontSize: 12,
    fontFamily: "math",
  },
});
