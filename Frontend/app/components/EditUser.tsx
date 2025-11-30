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
import { User } from "../types/User";
import { Checkbox } from "react-native-paper";
import { Role } from "../types/Role";
import { Picker } from "@react-native-picker/picker";

type EditUserModalProps = {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onUpdated: (user: User) => void;
};

export default function EditUserModal({
  visible,
  user,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "");
  const [isBlocked, setIsBlocked] = useState<boolean>(user?.isBlocked ?? false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSurname(user.surname);
      setUsername(user.username);
      setEmail(user.email);
      setRole(user.role);
      setIsBlocked(user.isBlocked);
      fetchRoles();
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const res = await api.get(`/User/role`);
      setRoles(res.data);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  if (!user) return null;

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // 1) Atnaujinam rolę
      await api.post(`/User/role`, {
        id: user.id,
        newRole: role,
      });

      if (isBlocked) {
        // 2) Atnaujinam blokavimo statusą (jei nori palikti blokavimo logiką)
        const res = await api.post(`/User/block/${user.id}`, {
          isBlocked: isBlocked,
        });
        // grąžinam atnaujintą user'į į tėvinį komponentą
        onUpdated(res.data);
      }
    } catch (err: any) {
      console.log(err.response?.data || err.message);
    } finally {
      setSaving(false);
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
          <Text style={cards.title}>Edit user</Text>

          <TextInput
            editable={false}
            style={cards.label}
            value={`Name: ${name}`}
          />
          <TextInput
            editable={false}
            style={cards.label}
            value={`Surname: ${surname}`}
          />
          <TextInput
            editable={false}
            style={cards.label}
            value={`Username: ${username}`}
          />
          <TextInput
            editable={false}
            style={cards.label}
            value={`Email: ${email}`}
          />
          <TextInput
            editable={false}
            style={cards.label}
            value={`Role: ${role}`}
          />

          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue as string)}
          >
            {/* placeholder, jei rolė dar nepasirinkta */}
            <Picker.Item label="Select role..." value="" />

            {roles.map((r) => (
              <Picker.Item
                key={r.id}
                label={r.name}
                value={r.name} // arba r.id, jei backend’e naudoji Id
              />
            ))}
          </Picker>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Checkbox
              status={isBlocked ? "checked" : "unchecked"}
              onPress={() => setIsBlocked(!isBlocked)}
            />
            <Text style={{ marginLeft: 8 }}>Blocked?</Text>
          </View>

          <View style={cards.actions}>
            <TouchableOpacity
              style={[cards.button, cards.cancelButton]}
              onPress={onClose}
              disabled={saving}
            >
              <Text style={cards.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[cards.button, cards.createButton]}
              onPress={handleSave}
              disabled={saving}
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
