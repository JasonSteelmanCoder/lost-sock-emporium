import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const imagesSlice = createSlice({
    name: 'imagesSlice',
    initialState,
    reducers: {
        'addImage': (state, action) => {
            const newState = {...state};
            newState[action.payload.product_id] = action.payload.image_url;
            return newState;
        },
    },
});

export const { addImage } = imagesSlice.actions;

export default imagesSlice.reducer;


