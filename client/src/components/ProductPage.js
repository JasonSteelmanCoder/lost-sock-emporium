import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../API_helpers/APIHelpers.js';
import { populateProducts } from './displayedProductsSlice.js';

const ProductPage = () => {

    const [product_index, setProduct_index] = useState(-1);
    const [displayedProducts, setDisplayedProducts] = useState();

    const { product_id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            const productsData = await fetchAllProducts();
            dispatch(populateProducts(productsData));
            setDisplayedProducts(productsData);
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        if (displayedProducts) {
            setProduct_index(displayedProducts.findIndex((product) => product.product_id === Number(product_id)));
        }
    }, [displayedProducts]);

    return (
        <div id='product-page'>
            <h1>{product_index !== -1 && displayedProducts ? displayedProducts[product_index].product_name : "loading..."}</h1>
            <p>{product_index !== -1 && displayedProducts ? displayedProducts[product_index].description : "loading..."}</p>
            <p>{product_index !== -1 && displayedProducts ? displayedProducts[product_index].price : "loading..."}</p>
            <form>
                <label htmlFor='quantity-input'>Quantity: </label>
                <input id='quantity-input'></input>
                <input type='submit' ></input>
            </form>
        </div>
    );
};

export default ProductPage;
