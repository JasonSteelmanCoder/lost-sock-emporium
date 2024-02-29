import React from "react";
import "../css/ProductCard.css";
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { API_ENDPOINT } from "../API_helpers/APIEndpoint";

const ProductCard = ({product}) => {

    const [image, setImage] = useState(null);

    useEffect(() => {
        const retrieveImage = async () => {
            try {
                const retrievedImage = await fetch(`${API_ENDPOINT}/images/${product.image_name}`);
                const blob = await retrievedImage.blob();
                const url = URL.createObjectURL(blob);
                setImage(url);
            } catch (err) {
                console.log(err);
            };
        };
        retrieveImage();
    }, []);

    return (
        <Link to={`products/${product.product_id}`} className="product-card" >
            <div className="details-slider" >{product.description}</div>
            <img src={image} className="product-image" alt="sock" />
            <p>{product.product_name}</p>
        </Link>
    );
};

export default ProductCard;