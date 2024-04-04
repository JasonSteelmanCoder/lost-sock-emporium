import React, { useState, useEffect } from 'react';
import '../css/OrderHistory.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OrderCard from './OrderCard';
import { fetchOrdersByUserId, fetchUsername } from '../API_helpers/APIHelpers';

const OrderHistory = () => {
    const authenticated = useSelector((state) => state.auth.authenticated);
    const user_id = useSelector((state) => state.auth.user_id);

    const [username, setUsername] = useState("")
    const [orders, setOrders] = useState([]);       // a list of objects with order_id and user_id properties

    useEffect(() => {
        if (authenticated) {
            const getUserName = async () => {
                const response = await fetchUsername(user_id);
                const data = await response.json();
                const newName = data.username;
                setUsername(newName);
            }

            getUserName();

            const getOrders = async () => {
                try {
                    const response = await fetchOrdersByUserId(user_id);
                    const data = await response.json();
                    setOrders(data);
                } catch (err) {
                    console.log(err);
                }
            }

            getOrders();
        }
    }, []);

    return (
        <div id='order-history'>
            {
                !authenticated 
                    ? 
                        <p>Please <Link to="/login">login</Link> to see your order history.</p> 
                    : 
                        <>
                            <h1 id='username'>Order History for {username}</h1>
                            {orders.length 
                                ? 
                                    orders.map((order) => <OrderCard order_id={order.order_id} key={order.order_id} />) 
                                : 
                                    <p className='text'>No orders yet! Return to the <Link to='/'>products page</Link> to get started!</p> }
                        </>
            }
        </div>
    )
}

export default OrderHistory;