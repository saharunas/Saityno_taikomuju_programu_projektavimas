import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../api";
import Toolbar from "../components/Toolbar";
import { Post } from "../types/Post";
import CreatePostModal from "../components/CreatePost";
import EditPostModal from "../components/EditPost";
import { cards } from "../styles/components";
import { layout } from "../styles/layout";
import { typography } from "../styles/typography";
import Footer from "../components/Footer";

export default function Posts() {
  const router = useRouter();
  const { communityId } = useLocalSearchParams<{ communityId: string }>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const numericCommunityId = Number(communityId);

  useEffect(() => {
    if (!numericCommunityId) return;
    fetchAll();
  }, [numericCommunityId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/Post/community/${numericCommunityId}`);
      setPosts(response.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert("Error", "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // EditPostModal will call onUpdated(updatedPostFromApi)
  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // EditPostModal will call onDeleted(id)
  const handlePostDeleted = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setEditVisible(true);
  };

  const formatDateTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString();
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
          <Text style={layout.buttonText}>+ New post</Text>
        </TouchableOpacity>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={
              posts.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={
              <Text style={typography.emptyText}>No posts yet.</Text>
            }
            renderItem={({ item }) => (
              <View style={cards.cardRow}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    router.push({
                      pathname: "/pages/Comments",
                      params: { postId: item.id },
                    })
                  }
                >
                  <View>
                    <Text style={typography.name}>{item.title}</Text>
                    <Text style={typography.description} numberOfLines={2}>
                      {item.text}
                    </Text>
                    <Text style={typography.meta}>
                      By {item.authorUsername}
                      {item.creationDate
                        ? ` · ${formatDateTime(item.creationDate)}`
                        : ""}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* RIGHT: Edit button – backend says via canEdit */}
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

      {/* Create modal (does POST /Post internally) */}
      <CreatePostModal
        visible={createVisible}
        community_id={numericCommunityId}
        onClose={() => setCreateVisible(false)}
        onCreated={handlePostCreated}
      />

      {/* Edit/Delete modal (does PUT/DELETE internally) */}
      <EditPostModal
        visible={editVisible}
        post={selectedPost}
        onClose={() => setEditVisible(false)}
        onUpdated={handlePostUpdated}
        onDeleted={handlePostDeleted}
      />
      <Footer />
    </View>
  );
}
