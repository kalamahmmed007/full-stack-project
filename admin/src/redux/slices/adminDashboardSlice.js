// src/redux/slices/adminDashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setStats, setCharts, setLoading, setError } =
    adminDashboardSlice.actions;

// 🔥 THIS IS WHAT YOUR FILE WAS MISSING
export default adminDashboardSlice.reducer;
