import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ProductPage.css';
import { fetchProductById } from '../API_helpers/APIHelpers.js';
import { API_ENDPOINT } from '../API_helpers/APIEndpoint.js';
import store from '../store.js';
import { addCartItem } from './cartSlice.js';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProductPage = () => {

    const [displayedProduct, setDisplayedProduct] = useState();
    const [image, setImage] = useState();

    const { product_id } = useParams();
    const navigate = useNavigate();
    const cart = useSelector(state => state.cart);

    useEffect(() => {
        const fetchProduct = async () => {
            const productData = await fetchProductById(product_id);
            setDisplayedProduct(productData);
        }
        fetchProduct();
    }, []);

    useEffect(() => {
        if (displayedProduct) {
            const fetchImage = async () => {
                try {
                    const imageData = await fetch(`${API_ENDPOINT}/images/${displayedProduct.image_name}`);
                    const blob = await imageData.blob();
                    const url = URL.createObjectURL(blob);
                    setImage(url);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchImage();
        }
    }, [displayedProduct]);

    const handleAddToCart = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);
        store.dispatch(addCartItem({
            product_id: product_id,
            quantity: formProps.quantity            
        }));
        alert("Product successfully added to cart!");
        navigate('/');
    };

    const productIsInCart = () => {
        for (let item of cart) {
            if (item.product_id === product_id) {
                return true;
            }
        }
        return false;
    };

    return (
        <div id='product-page'>
            <h1>{displayedProduct ? displayedProduct.product_name : "loading..."}</h1>
            <div id='product-summary'>
                <img src={image ? image : null} id='product-image'/>
                <div id='summary-text'>
                    <p>{displayedProduct ? displayedProduct.description : "loading..."}</p>
                    <p>{displayedProduct ? displayedProduct.price : "loading..."}</p>
                </div>
            </div>
            {productIsInCart() ? 
                <p>Item already in <Link to="/cart" className='blue-link'>cart.</Link></p> : 
                <form onSubmit={handleAddToCart}>
                    <input type='submit' value='Add to cart' id='add-to-cart-button' ></input>
                    <label htmlFor='quantity-input'>Quantity: </label>
                    <input type='number' min="1" id='quantity-input' name='quantity' defaultValue={1} required></input>
                </form>
            }
        </div>
    );
};

export default ProductPage;
