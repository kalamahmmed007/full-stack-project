import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Replace with your backend API URL
const API_URL = 'http://localhost:5000/api/admin/dashboard';

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (dateRange = 'week', { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${API_URL}?range=${dateRange}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to load stats');
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: {},
        loading: false,
        error: null,
    },
    reducers: {},
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
    },
});

export default dashboardSlice.reducer;
