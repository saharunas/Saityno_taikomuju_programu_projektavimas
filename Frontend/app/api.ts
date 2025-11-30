import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

let accessToken: string | null = null;
const ACCESS_TOKEN_KEY = "accessToken";
const API_BASE_URL = "https://saitynai-vl9u5.ondigitalocean.app";

export const api = axios.create({
  baseURL: API_BASE_URL,
  //baseURL: "https://localhost:7068",
  timeout: 10000,
  withCredentials: true,
});

// Add a helper to set the access token when you log in
export async function setAccessToken(token: string | null) {
  accessToken = token;

  if (token) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export async function loadAccessTokenFromStorage() {
  const stored = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  accessToken = stored;
}

export const getAccessToken = () => {
  return accessToken;
};

api.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      config.headers = {} as any;
    }
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
