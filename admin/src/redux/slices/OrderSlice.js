// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
} from "../api/OrderApi";

/* =======================
   THUNKS
======================= */

export const getOrders = createAsyncThunk(
    "order/getOrders",
    async (params = {}, thunkAPI) => {
        try {
            const res = await fetchOrders(params);
            return res.data ?? res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const getOrder = createAsyncThunk(
    "order/getOrder",
    async (id, thunkAPI) => {
        try {
            const res = await fetchOrderById(id);
            return res.data ?? res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const changeOrderStatus = createAsyncThunk(
    "order/changeOrderStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const res = await updateOrderStatus(id, { status });
            return res.data ?? res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

/* =======================
   SLICE
======================= */

const orderSlice = createSlice({
    name: "order",
    initialState: {
        orders: [],
        total: 0,
        page: 1,
        perPage: 20,
        selectedOrder: null,
        loading: false,
        error: null,
    },
    reducers: {
        // 🔥 socket.io realtime
        addOrderRealtime(state, action) {
            state.orders.unshift(action.payload);
            state.total += 1;
        },
        updateOrderRealtime(state, action) {
            const updated = action.payload;
            const idx = state.orders.findIndex(
                (o) => o._id === updated._id || o.id === updated.id
            );

            if (idx !== -1) {
                state.orders[idx] = { ...state.orders[idx], ...updated };
            }

            if (
                state.selectedOrder &&
                (state.selectedOrder._id === updated._id ||
                    state.selectedOrder.id === updated.id)
            ) {
                state.selectedOrder = {
                    ...state.selectedOrder,
                    ...updated,
                };
            }
        },
        removeOrderRealtime(state, action) {
            const id = action.payload;
            state.orders = state.orders.filter(
                (o) => o._id !== id && o.id !== id
            );
            state.total = Math.max(0, state.total - 1);
        },
    },
    extraReducers: (builder) => {
        builder

            /* ===== GET ORDERS ===== */
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.orders = payload.orders ?? payload ?? [];
                state.total = payload.total ?? state.orders.length;
                state.page = payload.page ?? state.page;
                state.perPage = payload.perPage ?? state.perPage;
            })
            .addCase(getOrders.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            /* ===== GET SINGLE ORDER ===== */
            .addCase(getOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrder.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.selectedOrder = payload;
            })
            .addCase(getOrder.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            /* ===== UPDATE STATUS ===== */
            .addCase(changeOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changeOrderStatus.fulfilled, (state, { payload }) => {
                state.loading = false;

                const idx = state.orders.findIndex(
                    (o) => o._id === payload._id || o.id === payload.id
                );

                if (idx !== -1) {
                    state.orders[idx] = {
                        ...state.orders[idx],
                        ...payload,
                    };
                }

                if (
                    state.selectedOrder &&
                    (state.selectedOrder._id === payload._id ||
                        state.selectedOrder.id === payload.id)
                ) {
                    state.selectedOrder = {
                        ...state.selectedOrder,
                        ...payload,
                    };
                }
            })
            .addCase(changeOrderStatus.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export const {
    addOrderRealtime,
    updateOrderRealtime,
    removeOrderRealtime,
} = orderSlice.actions;

export default orderSlice.reducer;
