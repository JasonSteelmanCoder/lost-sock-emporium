import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        'addCartItem': (state, action) => {
            return [
                ...state,
                action.payload
            ]
        },
        'deleteCartItem': (state, action) => {
            return state.filter((cartItem) => {
                return cartItem.productId !== action.payload
            })
        },
        'incrementCartItem': (state, action) => {
            const newState = []
            for (let cartItem of state) {
                if (cartItem.productId === action.payload) {
                    cartItem.quantity += 1;
                };
                newState.push(cartItem);
            };
            return newState;
        },
        'decrementCartItem': (state, action) => {
            const newState = []
            for (let cartItem of state) {
                if (cartItem.productId === action.payload) {
                    if (cartItem.quantity < 0) {
                        cartItem.quantity -= 1;
                    }
                };
                newState.push(cartItem);
            };
            return newState;
        },
        'setCartItemToNum': (state, action) => {
            if (action.payload < 1) {
                throw new Error('cart item quantities must be positive integers');
            };
            const newState = []
            for (let cartItem of state) {
                if (cartItem.productId === action.payload.productId) {
                    cartItem.quantity = action.payload.quantity;
                };
                newState.push(cartItem);
            };
            return newState;
        }
    }
})

export const {
    addCartItem,
    deleteCartItem,
    incrementCartItem,
    decrementCartItem,
    setCartItemToNum,
    cacheImageURL,
} = cartSlice.actions;

export default cartSlice.reducer;