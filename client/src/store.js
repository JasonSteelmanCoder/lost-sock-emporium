import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './components/cartSlice';
import authReducer from './components/authSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
    },
});

export default store;