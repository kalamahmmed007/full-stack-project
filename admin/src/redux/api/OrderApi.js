// src/redux/api/orderApi.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true,
});

export const fetchOrders = async (params = {}) => {
    const { data } = await api.get("/orders", { params });
    return data;
};

export const fetchOrderById = async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
};

export const updateOrderStatus = async (id, payload) => {
    const { data } = await api.put(`/orders/${id}/status`, payload);
    return data;
};

export default api;
