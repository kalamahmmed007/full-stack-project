// src/redux/slices/adminCategorySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categories: [],
    loading: false,
    error: null,
};

const adminCategorySlice = createSlice({
    name: "adminCategory",
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCategories, setLoading, setError } = adminCategorySlice.actions;

// 🚀 THIS is the missing line that caused the error
export default adminCategorySlice.reducer;
