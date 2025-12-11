// src/redux/slices/brandSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/brands"; // adjust to your backend

// Fetch all brands
export const getBrands = createAsyncThunk(
    "brand/getBrands",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(BASE_URL);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Fetch failed" });
        }
    }
);

// Create brand
export const createBrand = createAsyncThunk(
    "brand/createBrand",
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post(BASE_URL, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Creation failed" });
        }
    }
);

// Update brand
export const updateBrand = createAsyncThunk(
    "brand/updateBrand",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${BASE_URL}/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Update failed" });
        }
    }
);

// Delete brand
export const deleteBrand = createAsyncThunk(
    "brand/deleteBrand",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Delete failed" });
        }
    }
);

const brandSlice = createSlice({
    name: "brand",
    initialState: {
        brands: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all brands
            .addCase(getBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
            })
            .addCase(getBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Fetch failed";
            })

            // Create brand
            .addCase(createBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands.push(action.payload);
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Creation failed";
            })

            // Update brand
            .addCase(updateBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBrand = action.payload;
                state.brands = state.brands.map((b) =>
                    b.id === updatedBrand.id ? updatedBrand : b
                );
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Update failed";
            })

            // Delete brand
            .addCase(deleteBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = state.brands.filter((b) => b.id !== action.payload);
            })
            .addCase(deleteBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Delete failed";
            });
    },
});

// Selector to get brand by ID
export const getBrandById = (state, id) =>
    state.brand.brands.find((b) => b.id === id);

export default brandSlice.reducer;
