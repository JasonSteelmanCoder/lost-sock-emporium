import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const displayedProductsSlice = createSlice({
    name: 'displayedProducts',
    initialState,
    reducers: {
        'populateProducts': (state, action) => {
            return action.payload;
        }
    },
});

export const { populateProducts } = displayedProductsSlice.actions;

export default displayedProductsSlice.reducer;