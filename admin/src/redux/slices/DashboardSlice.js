// src/redux/slices/DashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

const API_URL = 'http://localhost:5000/api/admin/dashboard';

// Fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (dateRange = 'week', { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/dashboard/stats?range=${dateRange}`);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch dashboard stats');
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch dashboard stats');
        }
    }
);

const initialState = {
    stats: {
        totalRevenue: 0,
        revenueChange: 0,
        totalOrders: 0,
        ordersChange: 0,
        totalCustomers: 0,
        customersChange: 0,
        totalProducts: 0,
        productsChange: 0
    },
    loading: false,
    error: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
