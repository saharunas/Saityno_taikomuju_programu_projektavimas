// src/components/EditCommunity.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Community } from "../types/Community";
import { api } from "../api";
import { cards } from "../styles/components";

type EditCommunityModalProps = {
  visible: boolean;
  community: Community | null;
  onClose: () => void;
  onUpdated: (community: Community) => void;
  onDeleted: (id: number) => void;
};

export default function EditCommunityModal({
  visible,
  community,
  onClose,
  onUpdated,
  onDeleted,
}: EditCommunityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description);
    }
  }, [community]);

  if (!community) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/Community/${community.id}`, {
        name,
        description,
      });

      onUpdated(res.data); // ⬅️ new updated community
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
      await api.delete(`/Community/${community.id}`);
      onDeleted(community.id); // ⬅️ notify parent
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={cards.backdrop}>
        <View style={cards.cardModal}>
          <Text style={cards.title}>Edit Community</Text>

          <Text style={cards.label}>Name</Text>
          <TextInput style={cards.input} value={name} onChangeText={setName} />

          <Text style={cards.label}>Description</Text>
          <TextInput
            style={[cards.input, cards.textArea]}
            value={description}
            onChangeText={setDescription}
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
                <ActivityIndicator size="small" />
              ) : (
                <Text style={cards.deleteButton}>Delete</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[cards.button, cards.createButton]}
              onPress={handleSave}
              disabled={saving || deleting}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
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
