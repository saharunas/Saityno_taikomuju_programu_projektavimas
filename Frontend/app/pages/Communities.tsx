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
import Footer from "../components/Footer";

export default function Communities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const response = await api.get("/Community");
      setCommunities(response.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  // called when CreateCommunityModal successfully creates one (POST)
  const handleCommunityCreated = (newCommunity: Community) => {
    setCommunities((prev) => [...prev, newCommunity]);
  };

  // called when EditCommunityModal successfully saves (PUT)
  const handleCommunityUpdated = (updated: Community) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  // called when EditCommunityModal successfully deletes (DELETE)
  const handleCommunityDeleted = (id: number) => {
    setCommunities((prev) => prev.filter((c) => c.id !== id));
  };

  const openEditModal = (community: Community) => {
    setSelectedCommunity(community);
    setEditVisible(true);
  };

  return (
    <View style={layout.container}>
      <Toolbar />

      <View style={layout.content}>
        {/* Create button */}
        <TouchableOpacity
          style={layout.createButton}
          onPress={() => setCreateVisible(true)}
        >
          <Text style={layout.buttonText}>+ New community</Text>
        </TouchableOpacity>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={communities}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={
              communities.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={
              <Text style={typography.emptyText}>No communities yet.</Text>
            }
            renderItem={({ item }) => (
              <View style={cards.cardRow}>
                {/* LEFT: Card content → navigate to posts */}
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    router.push({
                      pathname: "/pages/Posts",
                      params: { communityId: item.id },
                    })
                  }
                >
                  <View>
                    <Text style={typography.name}>{item.name}</Text>
                    <Text style={typography.description}>
                      {item.description}
                    </Text>
                    <Text style={typography.meta}>
                      Created by {item.authorUsername}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* RIGHT: Edit button – backend decides via canEdit */}
                {item.canEdit && (
                  <TouchableOpacity
                    style={layout.createButton}
                    onPress={() => openEditModal(item)}
                  >
                    <Text style={layout.buttonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>

      {/* Create modal (handles POST internally) */}
      <CreateCommunityModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreated={handleCommunityCreated}
      />

      {/* Edit/Delete modal (handles PUT/DELETE internally) */}
      <EditCommunityModal
        visible={editVisible}
        community={selectedCommunity}
        onClose={() => setEditVisible(false)}
        onUpdated={handleCommunityUpdated}
        onDeleted={handleCommunityDeleted}
      />
      <Footer />
    </View>
  );
}
