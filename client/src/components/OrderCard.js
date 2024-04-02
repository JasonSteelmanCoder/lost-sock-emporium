import React, { useEffect, useState } from 'react';
import OrderedProductCard from './OrderedProductCard';
import { fetchProductsByOrderId } from '../API_helpers/APIHelpers';
import '../css/OrderCard.css';

const OrderCard = ({order_id}) => {

    // an array of objects with order_id, product_id, and quantity properties
    const [orderedProducts, setOrderedProducts] = useState([]);
    // an object where the keys are product_id's and values are the subtotal prices of those products for this order
    const [subtotals, setSubtotals] = useState({});
    const [orderTotal, setOrderTotal] = useState(0);

    useEffect(() => {
        const getOrderedProducts = async () => {
            const response = await fetchProductsByOrderId(order_id);
            const data = await response.json();
            setOrderedProducts(data);
        }

        getOrderedProducts();
    }, []);

    useEffect(() => {
        if (Object.keys(subtotals).length > 0) {
            let total = 0;
            console.log(subtotals);
            for (let key in subtotals) {
                total += subtotals[key];
            }
            setOrderTotal(total);
        }
    }, [subtotals])

    return (
        <div id='order-card'>
            <h2>Order # {order_id}</h2>
            {orderedProducts.map((orderedProduct) => <OrderedProductCard orderedProductId={orderedProduct.product_id} orderedProductQuantity={orderedProduct.quantity} key={orderedProduct.product_id} subtotals={subtotals} setSubtotals={setSubtotals} />)}
            <h2>Total: ${orderTotal ? orderTotal : ""}</h2>
        </div>
    )
};

export default OrderCard;