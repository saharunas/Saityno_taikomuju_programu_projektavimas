import AsyncStorage from "@react-native-async-storage/async-storage";
import { CurrentUser } from "./types/CurrentUser";

const KEY = "currentUser";

export async function saveCurrentUser(user: CurrentUser) {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}

export async function loadCurrentUser(): Promise<CurrentUser | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearCurrentUser() {
  await AsyncStorage.removeItem(KEY);
}
