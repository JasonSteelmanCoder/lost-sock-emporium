import React from 'react';
import OrderedProductCard from './OrderedProductCard';

const OrderCard = () => {
    return (
        <div id='order-card'>
            <h2>Order Number: </h2>
            <OrderedProductCard />
            <h2>Total: </h2>
        </div>
    )
};

export default OrderCard;