import React from 'react';
import '../css/OrderHistory.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const authenticated = useSelector((state) => state.auth.authenticated);

    return (
        <div id='order-history'>
            {
                !authenticated 
                ? <p>Please <Link to="/login">login</Link> to see your order history.</p> 
                : <p>Order history...</p>
            }
        </div>
    )
}

export default OrderHistory;