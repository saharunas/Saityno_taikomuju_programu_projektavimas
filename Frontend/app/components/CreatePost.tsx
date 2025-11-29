// src/components/CreatePost.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { api } from "../api";
import { Post } from "../types/Post";
import { cards } from "../styles/components";

type CreatePostModalProps = {
  visible: boolean;
  community_id: number; // matches your current usage
  onClose: () => void;
  onCreated: (post: Post) => void;
};

export default function CreatePostModal({
  visible,
  community_id,
  onClose,
  onCreated,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setText("");
  };

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/Post", {
        community_id,
        title,
        text,
      });

      onCreated(res.data); // ← return created post
      resetForm();
      onClose();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={cards.backdrop}>
        <View style={cards.cardModal}>
          <Text style={cards.title}>New post</Text>

          <Text style={cards.label}>Title</Text>
          <TextInput
            style={cards.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={cards.label}>Text</Text>
          <TextInput
            style={[cards.input, cards.textArea]}
            placeholder="Write your post..."
            value={text}
            onChangeText={setText}
            multiline
          />

          <View style={cards.actions}>
            <TouchableOpacity
              style={[cards.button, cards.cancelButton]}
              onPress={() => {
                resetForm();
                onClose();
              }}
              disabled={loading}
            >
              <Text style={cards.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[cards.button, cards.createButton]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={cards.createText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
