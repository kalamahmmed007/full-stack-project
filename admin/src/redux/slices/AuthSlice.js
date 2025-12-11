import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Get user from localStorage
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        return null;
    }
};

const getTokenFromStorage = () => {
    return localStorage.getItem('token') || null;
};

const initialState = {
    user: getUserFromStorage(),
    token: getTokenFromStorage(),
    isAuthenticated: !!getTokenFromStorage(),
    loading: false,
    error: null
};

// Login user
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', credentials);

            if (response.data.success) {
                const { token, user } = response.data.data;

                // Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Set default authorization header
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return { token, user };
            } else {
                return rejectWithValue(response.data.message || 'Login failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            return rejectWithValue(message);
        }
    }
);

// Register user (admin/staff)
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);

            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Registration failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            return rejectWithValue(message);
        }
    }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await axiosInstance.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to get user');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to get user';
            return rejectWithValue(message);
        }
    }
);

// Logout user
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/auth/logout');

            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Remove authorization header
            delete axiosInstance.defaults.headers.common['Authorization'];

            return null;
        } catch (error) {
            // Even if API call fails, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axiosInstance.defaults.headers.common['Authorization'];

            return null;
        }
    }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });

            if (response.data.success) {
                return response.data.message;
            } else {
                return rejectWithValue(response.data.message || 'Failed to send reset email');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to send reset email';
            return rejectWithValue(message);
        }
    }
);

// Reset password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', { token, password });

            if (response.data.success) {
                return response.data.message;
            } else {
                return rejectWithValue(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to reset password';
            return rejectWithValue(message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })

            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Current User
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })

            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;