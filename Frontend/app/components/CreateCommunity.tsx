// src/components/CreateCommunity.tsx
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
import { Community } from "../types/Community";
import { cards } from "../styles/components";

type CreateCommunityModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreated: (community: Community) => void;
};

export default function CreateCommunityModal({
  visible,
  onClose,
  onCreated,
}: CreateCommunityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await api.post("/Community", {
        name,
        description,
      });

      onCreated(res.data); // ⬅️ send new community upward
      resetForm();
      onClose();
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={cards.backdrop}>
        <View style={cards.cardModal}>
          <Text style={cards.title}>New Community</Text>

          <Text style={cards.label}>Name</Text>
          <TextInput
            style={cards.input}
            placeholder="Community name"
            value={name}
            onChangeText={setName}
          />

          <Text style={cards.label}>Description</Text>
          <TextInput
            style={[cards.input, cards.textArea]}
            placeholder="Say something about this community..."
            value={description}
            onChangeText={setDescription}
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
                <ActivityIndicator color="#fff" />
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
