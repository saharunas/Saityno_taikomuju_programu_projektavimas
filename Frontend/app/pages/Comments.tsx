import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { api } from "../api";
import { Comment } from "../types/Comment";
import CreateCommentModal from "../components/CreateComment";
import EditCommentModal from "../components/EditComment";
import Toolbar from "../components/Toolbar";
import { layout } from "../styles/layout";
import { cards } from "../styles/components";
import { useLocalSearchParams } from "expo-router";
import { typography } from "../styles/typography";
import Footer from "../components/Footer";

export default function Comments() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const numericPostId = Number(postId);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (!numericPostId) return;
    fetchComments();
  }, [numericPostId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/Comment/post/${numericPostId}`);
      setComments(res.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentUpdated = (updated: Comment) => {
    setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleCommentDeleted = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const openEditModal = (comment: Comment) => {
    setSelectedComment(comment);
    setEditVisible(true);
  };

  const formatDate = (value: string) => {
    const d = new Date(value);
    return d.toLocaleString();
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
          <Text style={layout.buttonText}>+ Comment</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={
              comments.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={
              <Text style={typography.emptyText}>No comments yet.</Text>
            }
            renderItem={({ item }) => (
              <View style={cards.cardRow}>
                <View style={layout.flex1}>
                  <Text style={typography.name}>{item.authorUsername}</Text>
                  <Text style={typography.description}>{item.text}</Text>
                  <Text style={typography.meta}>
                    {formatDate(item.creationDate)}
                  </Text>
                </View>

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

      {/* Create modal (does POST /Comment internally) */}
      <CreateCommentModal
        visible={createVisible}
        post_id={numericPostId} // 👈 rename from post_id to postId
        onClose={() => setCreateVisible(false)}
        onCreated={handleCommentCreated}
      />

      {/* Edit/Delete modal (does PUT/DELETE internally) */}
      <EditCommentModal
        visible={editVisible}
        comment={selectedComment}
        onClose={() => setEditVisible(false)}
        onUpdated={handleCommentUpdated}
        onDeleted={handleCommentDeleted}
      />
      <Footer />
    </View>
  );
}
