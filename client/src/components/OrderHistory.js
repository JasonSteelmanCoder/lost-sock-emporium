import React, { useState, useEffect } from 'react';
import '../css/OrderHistory.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OrderCard from './OrderCard';
import { fetchUsername } from '../API_helpers/APIHelpers';

const OrderHistory = () => {
    const authenticated = useSelector((state) => state.auth.authenticated);
    const user_id = useSelector((state) => state.auth.user_id);

    const [username, setUsername] = useState("")
    useEffect(() => {
        if (authenticated) {
            const getUserName = async () => {
                const response = await fetchUsername(user_id);
                const data = await response.json();
                const newName = data.username;
                setUsername(newName);
            }

            getUserName();
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
                        <h1 id='username'>{username}</h1>
                        <OrderCard />
                    </>
            }
        </div>
    )
}

export default OrderHistory;