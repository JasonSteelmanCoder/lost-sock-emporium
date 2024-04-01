import React, { useState } from 'react';
import OrderedProductCard from './OrderedProductCard';

const OrderCard = ({order_id}) => {

    const [orderId, setOrderId] = useState(order_id);
    const [orderedProducts, setOrderedProducts] = useState(); 

    return (
        <div id='order-card'>
            <h2>Order # {orderId}</h2>
            <OrderedProductCard />
            <h2>Total: </h2>
        </div>
    )
};

export default OrderCard;