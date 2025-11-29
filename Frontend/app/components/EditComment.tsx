// src/components/EditComment.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Comment } from "../types/Comment";
import { api } from "../api";
import { cards } from "../styles/components";

type EditCommentModalProps = {
  visible: boolean;
  comment: Comment | null;
  onClose: () => void;
  onUpdated: (comment: Comment) => void;
  onDeleted: (id: number) => void;
};

export default function EditCommentModal({
  visible,
  comment,
  onClose,
  onUpdated,
  onDeleted,
}: EditCommentModalProps) {
  const [text, setText] = useState(comment?.text ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (comment) {
      setText(comment.text);
    }
  }, [comment]);

  if (!comment) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/Comment/${comment.id}`, {
        text,
      });

      onUpdated(res.data); // ← updated comment
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
      await api.delete(`/Comment/${comment.id}`);
      onDeleted(comment.id);
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
          <Text style={cards.title}>Edit comment</Text>

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
