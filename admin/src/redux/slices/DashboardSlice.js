// dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardApi from '../api/dashboardApi';

export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async () => {
        const res = await dashboardApi.getStats();
        return res.data;
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default dashboardSlice.reducer;
