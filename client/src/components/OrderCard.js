import React, { useEffect, useState } from 'react';
import OrderedProductCard from './OrderedProductCard';
import { fetchProductsByOrderId } from '../API_helpers/APIHelpers';

const OrderCard = ({order_id}) => {

    const [orderedProducts, setOrderedProducts] = useState([]); 

    useEffect(() => {
        const getOrderedProducts = async () => {
            const response = await fetchProductsByOrderId(order_id);
            const data = await response.json();
            setOrderedProducts(data);
        }

        getOrderedProducts();
    }, []);

    return (
        <div id='order-card'>
            <h2>Order # {order_id}</h2>
            {orderedProducts.map((orderedProduct) => <OrderedProductCard orderedProductId={orderedProduct.product_id} orderedProductQuantity={orderedProduct.quantity} key={orderedProduct.order_id} />)}
            <h2>Total: </h2>
        </div>
    )
};

export default OrderCard;