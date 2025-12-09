import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orders: [],
    orderDetails: null,
    loading: false,
    error: null,
};

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setOrderDetails: (state, action) => {
            state.orderDetails = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const order = state.orders.find((o) => o._id === id);
            if (order) {
                order.status = status;
            }
            if (state.orderDetails && state.orderDetails._id === id) {
                state.orderDetails.status = status;
            }
        },
    },
});

export const {
    setOrders,
    setOrderDetails,
    setLoading,
    setError,
    updateOrderStatus,
} = adminOrderSlice.actions;

// 🔥 CRUCIAL — THIS FIXES YOUR ERROR
export default adminOrderSlice.reducer;
