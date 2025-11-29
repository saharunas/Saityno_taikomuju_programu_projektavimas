import React from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { toolbarStyles } from "../styles/components";
import { api } from "../api";

type ToolbarProps = {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
  onLogout?: () => void; // ← NEW
};

const Toolbar: React.FC<ToolbarProps> = ({
  title = "",
  showBack = false,
  showLogout = false,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[toolbarStyles.container, { paddingTop: insets.top }]}>
      <View style={toolbarStyles.inner}>
        {/* Back */}
        <View style={toolbarStyles.side}>
          {showBack ? (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
                size={24}
                color="#ffffff"
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        {/* Title */}
        <View style={toolbarStyles.center}>
          <Text style={toolbarStyles.title}>{title}</Text>
        </View>

        {/* Right icons */}
        <View style={[toolbarStyles.side, toolbarStyles.leftSide]}>
          <TouchableOpacity onPress={() => router.push("/pages/Home")}>
            <Ionicons name="home-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/pages/Communities")}>
            <Ionicons name="people-outline" size={20} color="#ffffff" />
          </TouchableOpacity>

          {showLogout && (
            <TouchableOpacity onPress={onLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ffcccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Toolbar;
