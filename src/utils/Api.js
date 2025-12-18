import axios from "axios";
const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL}/api/`, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Request timeout in milliseconds
});
export default api;