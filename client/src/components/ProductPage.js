import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPage.css';
import { fetchProductById } from '../API_helpers/APIHelpers.js';
import { API_ENDPOINT } from '../API_helpers/APIEndpoint.js';

const ProductPage = () => {

    const [displayedProduct, setDisplayedProduct] = useState();
    const [image, setImage] = useState();

    const { product_id } = useParams();

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
            <form>
                <input type='submit' value='Add to cart' id='add-to-cart-button' ></input>
                <label htmlFor='quantity-input'>Quantity: </label>
                <input id='quantity-input' defaultValue={1}></input>
            </form>
        </div>
    );
};

export default ProductPage;
