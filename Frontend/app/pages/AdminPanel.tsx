import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { api } from "../api";
import Toolbar from "../components/Toolbar";
import { Community } from "../types/Community";
import CreateCommunityModal from "../components/CreateCommunity";
import EditCommunityModal from "../components/EditCommunity";
import { cards } from "../styles/components";
import { useRouter } from "expo-router";
import { CurrentUser } from "../types/CurrentUser";
import { layout } from "../styles/layout";
import { typography } from "../styles/typography";
import { User } from "../types/User";
import EditUserModal from "../components/EditUser";
import Footer from "../components/Footer";

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  const [editVisible, setEditVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "Admin") {
      fetchAll();
    }
  }, [currentUser]);

  const fetchMe = async () => {
    try {
      const res = await api.get("/User/me");
      setCurrentUser(res.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  const fetchAll = async () => {
    try {
      const response = await api.get("/User");
      setUsers(response.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditVisible(true);
  };

  return (
    <View style={layout.container}>
      <Toolbar />

      <View style={layout.content}>
        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={
              users.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={
              <Text style={typography.emptyText}>No users found.</Text>
            }
            renderItem={({ item }) => (
              <View style={cards.cardRow}>
                {/* LEFT: Card content → navigate to posts */}
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => openEditModal(item)}
                >
                  <View>
                    <Text style={typography.name}>{item.username}</Text>
                    <Text style={typography.description}>{item.name}</Text>
                    <Text style={typography.description}>{item.surname}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
      {/* Create modal (handles POST internally) */}
      <EditUserModal
        visible={editVisible}
        user={selectedUser}
        onClose={() => setEditVisible(false)}
        onUpdated={() => null}
      />

      <Footer />
    </View>
  );
}
