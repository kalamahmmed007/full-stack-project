import { createSlice } from "@reduxjs/toolkit";

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        users: [],
        loading: false,
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        }
    }
});


export default adminUserSlice.reducer;
