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
                console.log(cartItem.product_id);
                return cartItem.product_id !== action.payload.product_id;
            })
        },
        'incrementCartItem': (state, action) => {
            const newState = []
            for (let cartItem of state) {
                if (cartItem.product_id === action.payload) {
                    cartItem.quantity += 1;
                };
                newState.push(cartItem);
            };
            return newState;
        },
        'decrementCartItem': (state, action) => {
            const newState = []
            for (let cartItem of state) {
                if (cartItem.product_id === action.payload) {
                    if (cartItem.quantity < 0) {
                        cartItem.quantity -= 1;
                    }
                };
                newState.push(cartItem);
            };
            return newState;
        },
        'setCartItemToNum': (state, action) => {
            if (action.payload.quantity < 1) {
                throw new Error('cart item quantities must be positive integers');
            };
            const newState = []
            for (let cartItem of state) {
                const newCartItem = {...cartItem};
                if (newCartItem.product_id === action.payload.product_id) {
                    newCartItem.quantity = action.payload.quantity;
                };
                newState.push(newCartItem);
            };
            return newState;
        },
        'emptyCart': (state, action) => {
            return initialState;
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
    emptyCart,
} = cartSlice.actions;

export default cartSlice.reducer;