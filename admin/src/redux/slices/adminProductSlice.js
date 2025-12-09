import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    productDetails: null,
    loading: false,
    error: null,
};

const adminProductSlice = createSlice({
    name: "adminProduct",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setProductDetails: (state, action) => {
            state.productDetails = action.payload;
        },
        addProduct: (state, action) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action) => {
            const updated = action.payload;
            state.products = state.products.map((product) =>
                product._id === updated._id ? updated : product
            );
        },
        deleteProduct: (state, action) => {
            state.products = state.products.filter(
                (p) => p._id !== action.payload
            );
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearProductState: (state) => {
            state.productDetails = null;
            state.error = null;
        },
    },
});

export const {
    setProducts,
    setProductDetails,
    addProduct,
    updateProduct,
    deleteProduct,
    setLoading,
    setError,
    clearProductState,
} = adminProductSlice.actions;

// 🔥 MUST HAVE — prevents the Vite error
export default adminProductSlice.reducer;
