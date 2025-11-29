// src/components/EditPost.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Post } from "../types/Post";
import { api } from "../api";
import { cards } from "../styles/components";

type EditPostModalProps = {
  visible: boolean;
  post: Post | null;
  onClose: () => void;
  onUpdated: (post: Post) => void;
  onDeleted: (id: number) => void;
};

export default function EditPostModal({
  visible,
  post,
  onClose,
  onUpdated,
  onDeleted,
}: EditPostModalProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [text, setText] = useState(post?.text ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setText(post.text);
    }
  }, [post]);

  if (!post) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/Post/${post.id}`, {
        title,
        text,
      });

      onUpdated(res.data); // ← updated post from backend
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/Post/${post.id}`);
      onDeleted(post.id); // ← just return id
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setDeleting(false);
      onClose();
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
          <Text style={cards.title}>Edit post</Text>

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
              onPress={onClose}
              disabled={saving || deleting}
            >
              <Text style={cards.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[cards.button, cards.deleteButton]}
              onPress={handleDelete}
              disabled={saving || deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#111827" />
              ) : (
                <Text style={cards.cancelText}>Delete</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[cards.button, cards.createButton]}
              onPress={handleSave}
              disabled={saving || deleting}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={cards.createText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
