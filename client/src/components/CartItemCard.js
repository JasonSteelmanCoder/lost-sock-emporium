import React from 'react';
import '../css/CartItemCard.css';
import { fetchProductById } from '../API_helpers/APIHelpers.js'
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../API_helpers/APIEndpoint.js';

const CartItemCard = ({ product_id, quantity }) => {
    const [product, setProduct] = useState({});
    const [image, setImage] = useState(null);

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

    return (
        <div id='cart-item-card'>
            <img src={image ? image : null} id='cart-item-image'></img>
            <div id='cart-item-text'>
                <h2>{product.product_name}</h2>
                <p>{product.description}</p>
                <p id='quantity-text'>Quantity: {quantity}</p>
                <button id='quantity-button'>Change quantity</button>
                <button id='remove-button'>Remove item</button>
            </div>
        </div>
    );
};

export default CartItemCard;