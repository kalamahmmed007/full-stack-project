// src/redux/slices/adminDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    stats: {
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
    },
    charts: {
        salesData: [],
        revenueData: [],
        userGrowth: [],
        topProducts: [],
    },
    loading: false,
    error: null,
};

// ✅ Async thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
    "Dashboard/fetchStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/admin/dashboard-stats"); // update with your API
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const adminDashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setCharts: (state, action) => {
            state.charts = { ...state.charts, ...action.payload };
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.charts = { ...state.charts, ...action.payload.charts };
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setStats, setCharts, setLoading, setError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
