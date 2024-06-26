import React from 'react';
import '../css/CartItemCard.css';
import { fetchProductById } from '../API_helpers/APIHelpers.js'
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../API_helpers/APIEndpoint.js';
import store from '../store.js';
import { deleteCartItem, setCartItemToNum } from './cartSlice.js';

const CartItemCard = ({ product_id, quantity }) => {
    const [product, setProduct] = useState({});
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState(null);

    const updatePrice = () => {
        // product price has the data type 'money' in the database, so we slice it to remove the dollar sign.
        setPrice(`\$${(Number(product.price.slice(1)) * Number(quantity)).toFixed(2)}`)
    }

    useEffect(() => {
        const fetchProductData = async () => {
            const response = await fetchProductById(product_id);
            setProduct(response);
        }

        fetchProductData();
    }, []);

    useEffect(() => {
        if (product) {
            const fetchImage = async () => {
                const data = await fetch(`${API_ENDPOINT}/images/${product.image_name}`);
                const blob = await data.blob();
                const url = URL.createObjectURL(blob);
                setImage(url);
            }
            fetchImage()
        };
    }, [product]);


    useEffect(() => {
        if (Object.keys(product).length > 0) {
            updatePrice();
        }
    }, [product, quantity])

    const handleRemoveItem = (event) => {
        store.dispatch(deleteCartItem({product_id}));
    };

    const handleQuantityChange = (event) => {
        const updatedQuantity = event.currentTarget.value;
        if (!/^\d+$/.test(updatedQuantity)) {
            event.currentTarget.value = "";
        } else if (Number(updatedQuantity) > 0) {
            store.dispatch(setCartItemToNum({product_id, quantity: updatedQuantity}));
        } else {
            event.currentTarget.value = "";
        }
    };

    return (
        <div id='cart-item-card'>
            <img src={image ? image : null} id='cart-item-image' alt='sock'></img>
            <div id='cart-item-text'>
                <h2>{product.product_name}</h2>
                <p>{product.description}</p>
                <p id='quantity-text'>Quantity: 
                    <input id='quantity-input' onInput={handleQuantityChange} type='number' defaultValue={quantity} name='quantity' min='1' required></input>
                </p>
                <span id='item-price'>{price}</span>
                <button id='remove-button' onClick={handleRemoveItem} className='dark-bg-link'>Remove item</button>
            </div>
        </div>
    );
};

export default CartItemCard;