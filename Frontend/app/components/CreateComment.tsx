// src/components/CreateComment.tsx
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
import { Comment } from "../types/Comment";
import { cards } from "../styles/components";

type CreateCommentModalProps = {
  visible: boolean;
  post_id: number;
  onClose: () => void;
  onCreated: (comment: Comment) => void;
};

export default function CreateCommentModal({
  visible,
  post_id,
  onClose,
  onCreated,
}: CreateCommentModalProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => setText("");

  const handleCreate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/Comment", {
        post_id,
        text,
      });

      onCreated(res.data); // ← created comment
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
          <Text style={cards.title}>New comment</Text>

          <Text style={cards.label}>Comment</Text>
          <TextInput
            style={[cards.input, cards.textArea]}
            placeholder="Write a comment..."
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
                <Text style={cards.createText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
