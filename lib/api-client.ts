import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_TMDB_URL;
const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});
