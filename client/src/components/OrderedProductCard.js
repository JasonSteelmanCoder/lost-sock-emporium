import React, { useState, useEffect } from "react";
import { fetchProductById } from "../API_helpers/APIHelpers";
import { API_ENDPOINT } from "../API_helpers/APIEndpoint";
import '../css/OrderedProductCard.css';

const OrderedProductCard = ({orderedProductId, orderedProductQuantity}) => {

    const [product, setProduct] = useState({});
    const [image, setImage] = useState([]);

    useEffect(() => {
        const getProduct = async () => {
            const response = await fetchProductById(orderedProductId);
            setProduct(response);
        }

        getProduct();
    }, []);

    useEffect(() => {
        const getImage = async () => {
            const data = await fetch(`${API_ENDPOINT}/images/${product.image_name}`);
            const blob = await data.blob();
            const url = URL.createObjectURL(blob);
            setImage(url);
        }

        getImage();
    }, [product])

    return (
        <div id="ordered-product-card">
            <img src={image} alt="sock" id="sock-image"/> 
            <div>
                <h3>Product: {product.product_name}</h3>
                <p>Description: {product.description}</p>
                <div id="spans">
                    <span>Quantity: {orderedProductQuantity}</span>
                    <span>Price: {product.price ? product.price : " "}</span>
                    <span>Subtotal: ${product.price ? Number(product.price.slice(1)) * orderedProductQuantity : " "}</span>
                </div>
            </div>
        </div>
    )
};

export default OrderedProductCard;