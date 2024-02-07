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

    return (
        <div className="product-card">
            <img src={image} className="product-image" />
            <p>{product.product_name}</p>
        </div>
    );
};

export default ProductCard;