// Toolbar.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Logout from "../components/Logout";
import { useUser } from "../context/UserContext"; // <-- svarbu

const BREAKPOINT = 768; // "desktop" riba

export default function Toolbar() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= BREAKPOINT;

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const router = useRouter();
  const { isAdmin } = useUser(); // <-- čia sužinom ar useris Admin

  const baseNavItems = [
    { key: "home", label: "Home", icon: "home-outline", path: "/pages/Home" },
    {
      key: "communities",
      label: "Communities",
      icon: "people-outline",
      path: "/pages/Communities",
    },
  ];

  // jei Admin – pridedam Admin panel
  const navItems = isAdmin
    ? [
        ...baseNavItems,
        {
          key: "admin",
          label: "Admin Panel",
          icon: "key",
          path: "/pages/AdminPanel",
        },
      ]
    : baseNavItems;

  const handleNavPress = (path: string) => {
    router.navigate(path as any);
    setMenuOpen(false);
  };

  const openLogout = () => {
    setMenuOpen(false);
    setLogoutVisible(true);
  };

  return (
    <>
      <View style={styles.wrapper}>
        {isDesktop ? (
          // DESKTOP – horizontali meniu juosta
          <View style={styles.desktopBar}>
            <Text style={styles.logo}>Saitynai</Text>

            <View style={styles.desktopNav}>
              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.desktopNavItem}
                  onPress={() => handleNavPress(item.path)}
                >
                  <Ionicons name={item.icon as any} size={22} />
                  <Text style={styles.desktopNavText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout mygtukas desktop */}
            <TouchableOpacity
              style={styles.desktopNavItem}
              onPress={openLogout}
            >
              <Ionicons name="log-out-outline" size={20} />
              <Text style={styles.desktopNavText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // MOBILE – logo + hamburger
          <>
            <View style={styles.mobileBar}>
              <Text style={styles.logo}>Saitynai</Text>

              <TouchableOpacity onPress={() => setMenuOpen(true)}>
                <Ionicons name="menu-outline" size={28} />
              </TouchableOpacity>
            </View>

            {/* Hamburger meniu kaip modalas */}
            <Modal
              visible={menuOpen}
              transparent
              animationType="slide"
              onRequestClose={() => setMenuOpen(false)}
            >
              <View style={styles.backdrop}>
                <View style={styles.mobileMenu}>
                  {navItems.map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.mobileNavItem}
                      onPress={() => handleNavPress(item.path)}
                    >
                      <Ionicons name={item.icon as any} size={22} />
                      <Text style={styles.mobileNavText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}

                  {/* Logout mygtukas mobile meniu viduje */}
                  <TouchableOpacity
                    style={styles.mobileNavItem}
                    onPress={openLogout}
                  >
                    <Ionicons name="log-out-outline" size={22} />
                    <Text style={styles.mobileNavText}>Logout</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setMenuOpen(false)}
                  >
                    <Text style={styles.closeText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>

      {/* Logout modalas – visada už toolbar, veikia ir desktop, ir mobile */}
      <Logout visible={logoutVisible} onClose={() => setLogoutVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff",
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "cursive",
  },

  // DESKTOP
  desktopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  desktopNav: {
    flexDirection: "row",
  },
  desktopNavItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginHorizontal: 8,
  },
  desktopNavText: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: "cursive",
  },

  // MOBILE
  mobileBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
  },
  mobileMenu: {
    marginTop: 60,
    marginHorizontal: 40,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  mobileNavItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  mobileNavText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: "cursive",
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeText: {
    fontSize: 14,
    fontFamily: "cursive",
  },
});
