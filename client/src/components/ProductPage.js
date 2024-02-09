import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {

    const { product_id } = useParams();

    return (
        <div>
            <h1>ProductPage</h1>
            <p>Product: {product_id}</p>
        </div>
    );
};

export default ProductPage;
