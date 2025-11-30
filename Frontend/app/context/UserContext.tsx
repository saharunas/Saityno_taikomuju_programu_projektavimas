import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";
import { CurrentUser } from "../types/CurrentUser";
import { router } from "expo-router";

type UserContextType = {
  user: CurrentUser | null;
  isAdmin: boolean;
  setUser: (u: CurrentUser | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const isAdmin = user?.role === "Admin";

  // -------- Helpers for AsyncStorage --------
  const saveUserToStorage = async (u: CurrentUser | null) => {
    if (!u) return AsyncStorage.removeItem("currentUser");
    await AsyncStorage.setItem("currentUser", JSON.stringify(u));
  };

  const loadUserFromStorage = async () => {
    const raw = await AsyncStorage.getItem("currentUser");
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  };

  // -------- Refresh user from backend --------
  const refreshUser = async () => {
    try {
      const res = await api.get("/User/me");
      setUser(res.data);
      await saveUserToStorage(res.data);
    } catch (err) {
      setUser(null);
      await saveUserToStorage(null);
    }
  };

  // -------- Logout --------
  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (_) {}

    setUser(null);
    await AsyncStorage.removeItem("currentUser");
    router.replace("/pages/Login");
  };

  // -------- Initial load --------
  useEffect(() => {
    const init = async () => {
      const cached = await loadUserFromStorage();
      if (cached) setUser(cached);
      await refreshUser();
    };

    init();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAdmin,
        setUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
