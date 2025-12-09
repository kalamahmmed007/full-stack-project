// src/redux/slices/adminCouponSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    coupons: [],
    loading: false,
    error: null,
};

const adminCouponSlice = createSlice({
    name: "adminCoupon",
    initialState,
    reducers: {
        setCoupons: (state, action) => {
            state.coupons = action.payload;
        },
        addCoupon: (state, action) => {
            state.coupons.push(action.payload);
        },
        removeCoupon: (state, action) => {
            state.coupons = state.coupons.filter(
                (c) => c._id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setCoupons,
    addCoupon,
    removeCoupon,
    setLoading,
    setError,
} = adminCouponSlice.actions;

// 🔥 THE IMPORTANT PART (missing before)
export default adminCouponSlice.reducer;
