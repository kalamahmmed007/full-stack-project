import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reviews: [],
    reviewDetails: null,
    loading: false,
    error: null,
};

const adminReviewSlice = createSlice({
    name: "adminReview",
    initialState,
    reducers: {
        setReviews: (state, action) => {
            state.reviews = action.payload;
        },
        setReviewDetails: (state, action) => {
            state.reviewDetails = action.payload;
        },
        approveReview: (state, action) => {
            const id = action.payload;
            state.reviews = state.reviews.map((review) =>
                review._id === id ? { ...review, approved: true } : review
            );
        },
        deleteReview: (state, action) => {
            const id = action.payload;
            state.reviews = state.reviews.filter((review) => review._id !== id);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearReviewState: (state) => {
            state.reviewDetails = null;
            state.error = null;
        },
    },
});

export const {
    setReviews,
    setReviewDetails,
    approveReview,
    deleteReview,
    setLoading,
    setError,
    clearReviewState,
} = adminReviewSlice.actions;

// 🔥 The missing piece — fixes Vite default export error
export default adminReviewSlice.reducer;
