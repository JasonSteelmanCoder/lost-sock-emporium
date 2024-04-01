import React from "react";

const OrderedProductCard = ({orderedProductId, orderedProductQuantity}) => {
    return (
        <div id="ordered-product-card">
            <div>{/* product image */}</div> 
            <div>
                <h3>Product: {orderedProductId}</h3>
                <p>Description: a sock that you ordered</p>
                <span>Quantity: {orderedProductQuantity}</span>
                <span>Price: </span>
            </div>
        </div>
    )
};

export default OrderedProductCard;