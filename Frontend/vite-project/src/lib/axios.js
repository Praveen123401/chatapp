import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5002/api`;

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});
