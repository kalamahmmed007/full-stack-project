import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    withCredentials: true,
});

/* 🔐 auto-attach token */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ======================
   AUTH
====================== */

export const adminLogin = async (payload) => {
    const { data } = await api.post("/admin/login", payload);
    return data; // { token, admin }
};

export const adminLogout = async () => {
    const { data } = await api.post("/admin/logout");
    return data;
};

export const getAdminProfile = async () => {
    const { data } = await api.get("/admin/profile");
    return data;
};

/* ======================
   ADMIN USERS
====================== */

export const fetchAdmins = async (params = {}) => {
    const { data } = await api.get("/admin/users", { params });
    return data; // { admins, total }
};

export const fetchAdminById = async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
};

export const createAdmin = async (payload) => {
    const { data } = await api.post("/admin/users", payload);
    return data;
};

export const updateAdmin = async (id, payload) => {
    const { data } = await api.put(`/admin/users/${id}`, payload);
    return data;
};

export const deleteAdmin = async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
};

export default api;
