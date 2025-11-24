import axios from "axios";

export const api = axios.create({
  baseURL: "https://saitynai-vl9u5.ondigitalocean.app",
  //baseURL: "https://localhost:7068",
  timeout: 10000,
  withCredentials: true,
});

// Add a helper to set the access token when you log in
export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAccessToken = () => {
  return api.defaults.headers.common["Authorization"] != null;
}
