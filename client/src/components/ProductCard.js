import React from "react";
import "../css/ProductCard.css";
import { useState, useEffect } from 'react'

const ProductCard = ({product}) => {

    const [image, setImage] = useState(null);

    useEffect(() => {
        const retrieveImage = async () => {
            try {
                const retrievedImage = await fetch(`http://localhost:3001/images/${product.image_name}`);
                const blob = await retrievedImage.blob();
                const url = URL.createObjectURL(blob);
                setImage(url);
            } catch (err) {
                console.log(err);
            };
        };
        retrieveImage();
    }, []);

    const handleMouseOver = (e) => {
        
    };
    const handleMouseLeave = (e) => {
        
    };

    return (
        <div className="product-card" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
            <div className="details-slider" >{product.description}</div>
            <img src={image} className="product-image" />
            <p>{product.product_name}</p>
        </div>
    );
};

export default ProductCard;