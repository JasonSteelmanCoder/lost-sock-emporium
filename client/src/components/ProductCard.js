import React from "react";
import "./ProductCard.css";

const ProductCard = ({product}) => {
    return (
        <div className="product-card">
            <p>{product}</p>
        </div>
    );
};

export default ProductCard;