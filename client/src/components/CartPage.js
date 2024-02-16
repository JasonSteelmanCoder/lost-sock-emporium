import React from 'react';
import '../css/CartPage.css';
import CartItemCard from './CartItemCard';
import { useSelector } from 'react-redux';

const CartPage = () => {
    const cart = useSelector(state => state.cart);

    return (
        <div id='cart-page'>
            <div id='checkout-interface'>
                <p>Checkout Interface</p>
            </div>
            <div id='ordered-products-details'>
                {cart.map((item) => {
                    return (
                        <CartItemCard key={item.product_id} product_id={item.product_id} quantity={item.quantity} />
                    )
                })}
            </div>
        </div>
    );
};

export default CartPage;