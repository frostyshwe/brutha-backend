import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333" // Altere para IP local se necessário
});

export default api;