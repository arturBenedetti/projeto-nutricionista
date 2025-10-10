import axios from "axios";

const api = axios.create({
  baseURL: "https://seu-backend.com/api", // Substitua pela sua URL base
});

export default {
  async getAll() {
    const { data } = await api.get("/pessoas");
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/pessoas/${id}`);
    return data;
  },
  async create(person) {
    const { data } = await api.post("/pessoas", person);
    return data;
  },
  async update(id, person) {
    const { data } = await api.put(`/pessoas/${id}`, person);
    return data;
  },
  async remove(id) {
    await api.delete(`/pessoas/${id}`);
  },
};
