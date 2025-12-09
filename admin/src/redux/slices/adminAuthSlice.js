import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: localStorage.getItem('adminToken') || null,
    isAuthenticated: !!localStorage.getItem('adminToken'),
    loading: false,
    error: null
};

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
            localStorage.setItem('adminToken', action.payload.token);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('adminToken');
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;