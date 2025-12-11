import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebarOpen: true,
    modalOpen: false,
    theme: "light", // or dark
    loading: false,
};

const adminUiSlice = createSlice({
    name: "adminUi",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        openModal: (state) => {
            state.modalOpen = true;
        },
        closeModal: (state) => {
            state.modalOpen = false;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        setUiLoading: (state, action) => {
            state.loading = action.payload;
        },
        resetUi: () => initialState,
    },
});

export const {
    toggleSidebar,
    openModal,
    closeModal,
    setTheme,
    setUiLoading,
    resetUi,
} = adminUiSlice.actions;

// 🔥 REQUIRED → fixes the “does not provide a default export” error
export default adminUiSlice.reducer;
