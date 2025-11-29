// src/screens/HomeScreen.tsx
import React, { useState } from "react";
import { View } from "react-native";
import Toolbar from "@/app/components/Toolbar";
import Logout from "../components/Logout";

export default function Home() {
  const [logoutVisible, setLogoutVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Toolbar
        title="Home"
        showBack
        showLogout
        onLogout={() => setLogoutVisible(true)}
      />

      <Logout visible={logoutVisible} onClose={() => setLogoutVisible(false)} />
    </View>
  );
}
