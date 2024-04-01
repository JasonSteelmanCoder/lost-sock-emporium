import React, { useState, useEffect } from "react";
import { fetchProductById } from "../API_helpers/APIHelpers";

const OrderedProductCard = ({orderedProductId, orderedProductQuantity}) => {

    const [product, setProduct] = useState({});

    useEffect(() => {
        const getProduct = async () => {
            const response = await fetchProductById(orderedProductId);
            console.log(response);
            setProduct(response);
        }

        getProduct();
    }, [])

    return (
        <div id="ordered-product-card">
            <div>{/* product image */}</div> 
            <div>
                <h3>Product: {product.product_name}</h3>
                <p>Description: {product.description}</p>
                <span>Quantity: {orderedProductQuantity}</span>
                <span>Price: {product.price}</span>
                <span>Subtotal: ${Number(product.price.slice(1)) * orderedProductQuantity}</span>
            </div>
        </div>
    )
};

export default OrderedProductCard;