import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: null,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        loginFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export default userSlice.reducer;
