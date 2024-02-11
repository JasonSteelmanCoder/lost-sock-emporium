import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './components/cartSlice';
import displayedProductsReducer from './components/displayedProductsSlice';
import imagesReducer from './components/imagesSlice';

const store = configureStore({
    reducer: {
        displayedProducts: displayedProductsReducer,
        cart: cartReducer,
        images: imagesReducer,
    },
});

export default store;