import React from "react";
import "../css/ProductCard.css";
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import store from '../store.js';
import { addImage } from "./imagesSlice";

const ProductCard = ({product}) => {

    const [image, setImage] = useState(null);

    useEffect(() => {
        const retrieveImage = async () => {
            try {
                const retrievedImage = await fetch(`http://localhost:3001/images/${product.image_name}`);
                const blob = await retrievedImage.blob();
                const url = URL.createObjectURL(blob);
                store.dispatch({
                    type: addImage,
                    payload: {
                        product_id: product.product_id,
                        image_url: url
                    },
                });
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
            <img src={image} className="product-image" />
            <p>{product.product_name}</p>
        </Link>
    );
};

export default ProductCard;