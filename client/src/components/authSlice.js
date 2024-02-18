import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authenticated: false,
    user_id: null
};

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        'signalLoggedOut': (state, action) => {
            return initialState;
        },

        'signalLoggedIn': (state, action) => {
            return {
                authenticated: true,
                user_id: action.payload.user_id
            }
        }
    },
});

export const {
    signalLoggedIn,
    signalLoggedOut
} = authSlice.actions;

export default authSlice.reducer;