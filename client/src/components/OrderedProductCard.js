import React from "react";

const OrderedProductCard = () => {
    return (
        <div id="ordered-product-card">
            <div>{/* product image */}</div> 
            <div>
                <h3>Product: </h3>
                <p>Description: a sock that you ordered</p>
                <span>Quantity: </span>
                <span>Price: </span>
            </div>
        </div>
    )
};

export default OrderedProductCard;