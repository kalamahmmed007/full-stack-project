// src/redux/api/orderApi.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchOrders = (params = {}) =>
    api.get("/orders", { params });

export const fetchOrderById = (id) =>
    api.get(`/orders/${id}`);

export const updateOrderStatus = (id, payload) =>
    api.put(`/orders/${id}/status`, payload);

export default api;
