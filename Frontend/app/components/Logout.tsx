// src/components/Logout.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Portal } from "react-native-paper";
import { useRouter } from "expo-router";
import { api } from "../api";
import { cards } from "../styles/components";

type LogoutProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Logout({ visible, onClose }: LogoutProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const confirmLogout = async () => {
    setLoading(true);
    try {
      await api.post("/user/logout");
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
      onClose();
    }
    router.navigate("/pages/Login");
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={cards.backdrop}>
        <View style={cards.areYouSure}>
          <Text style={cards.title}>Logout</Text>

          <Text style={cards.label}>Are you sure you want to logout?</Text>

          <View style={cards.actions}>
            <TouchableOpacity
              style={[cards.button, cards.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={cards.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[cards.button, cards.createButton]}
              onPress={confirmLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={cards.createText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
