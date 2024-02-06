import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './components/cartSlice';
import displayedProductsReducer from './components/displayedProductsSlice';

const store = configureStore({
    reducer: {
        displayedProducts: displayedProductsReducer,
        cart: cartReducer,
    },
});

export default store;