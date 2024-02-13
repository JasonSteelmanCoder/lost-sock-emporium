import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPage.css';
import { fetchProductById } from '../API_helpers/APIHelpers.js';


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
                    const imageData = await fetch(`http://localhost:3001/images/${displayedProduct.image_name}`);
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
            <img src={image ? image : null} />
            <p>{displayedProduct ? displayedProduct.description : "loading..."}</p>
            <p>{displayedProduct ? displayedProduct.price : "loading..."}</p>
            <form>
                <label htmlFor='quantity-input'>Quantity: </label>
                <input id='quantity-input'></input>
                <input type='submit' ></input>
            </form>
        </div>
    );
};

export default ProductPage;
