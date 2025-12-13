import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    adminLogin,
    adminLogout,
    getAdminProfile,
    fetchAdmins,
    fetchAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
} from "../api/adminUserApi";

/* ======================
   AUTH THUNKS
====================== */

export const loginAdmin = createAsyncThunk(
    "admin/login",
    async (payload, thunkAPI) => {
        try {
            const res = await adminLogin(payload);
            localStorage.setItem("adminToken", res.token);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const logoutAdmin = createAsyncThunk(
    "admin/logout",
    async (_, thunkAPI) => {
        try {
            await adminLogout();
            localStorage.removeItem("adminToken");
            return true;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const loadAdminProfile = createAsyncThunk(
    "admin/profile",
    async (_, thunkAPI) => {
        try {
            const res = await getAdminProfile();
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

/* ======================
   ADMIN USERS THUNKS
====================== */

export const getAdmins = createAsyncThunk(
    "admin/getAdmins",
    async (params = {}, thunkAPI) => {
        try {
            const res = await fetchAdmins(params);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const getAdmin = createAsyncThunk(
    "admin/getAdmin",
    async (id, thunkAPI) => {
        try {
            const res = await fetchAdminById(id);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const addAdmin = createAsyncThunk(
    "admin/addAdmin",
    async (payload, thunkAPI) => {
        try {
            const res = await createAdmin(payload);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const editAdmin = createAsyncThunk(
    "admin/editAdmin",
    async ({ id, payload }, thunkAPI) => {
        try {
            const res = await updateAdmin(id, payload);
            return res;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

export const removeAdmin = createAsyncThunk(
    "admin/removeAdmin",
    async (id, thunkAPI) => {
        try {
            await deleteAdmin(id);
            return id;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

/* ======================
   SLICE
====================== */

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        admin: null,
        admins: [],
        total: 0,
        selectedAdmin: null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem("adminToken"),
    },
    reducers: {
        clearAdminError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* ===== AUTH ===== */
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.admin = payload.admin;
                state.isAuthenticated = true;
            })
            .addCase(loginAdmin.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.isAuthenticated = false;
            })

            .addCase(loadAdminProfile.fulfilled, (state, { payload }) => {
                state.admin = payload;
                state.isAuthenticated = true;
            })

            /* ===== ADMIN USERS ===== */
            .addCase(getAdmins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAdmins.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.admins = payload.admins ?? payload ?? [];
                state.total = payload.total ?? state.admins.length;
            })
            .addCase(getAdmins.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            .addCase(getAdmin.fulfilled, (state, { payload }) => {
                state.selectedAdmin = payload;
            })

            .addCase(addAdmin.fulfilled, (state, { payload }) => {
                state.admins.unshift(payload);
                state.total += 1;
            })

            .addCase(editAdmin.fulfilled, (state, { payload }) => {
                const idx = state.admins.findIndex(
                    (a) => a._id === payload._id || a.id === payload.id
                );
                if (idx !== -1) state.admins[idx] = payload;
                if (
                    state.selectedAdmin &&
                    (state.selectedAdmin._id === payload._id ||
                        state.selectedAdmin.id === payload.id)
                ) {
                    state.selectedAdmin = payload;
                }
            })

            .addCase(removeAdmin.fulfilled, (state, { payload }) => {
                state.admins = state.admins.filter(
                    (a) => a._id !== payload && a.id !== payload
                );
                state.total = Math.max(0, state.total - 1);
            });
    },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
