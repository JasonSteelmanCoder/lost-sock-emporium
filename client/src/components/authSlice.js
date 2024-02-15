import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        'signalLoggedOut': (state, action) => {
            return false;
        },

        'signalLoggedIn': (state, action) => {
            return true;
        }
    },
});

export const {
    signalLoggedIn,
    signalLoggedOut
} = authSlice.actions;

export default authSlice.reducer;