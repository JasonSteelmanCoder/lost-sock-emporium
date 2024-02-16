import React from 'react';
import '../css/CartPage.css';
import CartItemCard from './CartItemCard';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const cart = useSelector(state => state.cart);

    return (
        <div id='cart-page'>
            <div id='checkout-interface'>
                <p>Checkout</p>
                <form>
                    <label>Label</label>
                    <br></br>
                    <input></input>
                    <br></br>
                </form>
            </div>
            <div id='ordered-products-details'>
                {
                    cart.length > 0 ? cart.map((item) => {
                        return (
                            <CartItemCard key={item.product_id} product_id={item.product_id} quantity={item.quantity} />
                        )
                    }) : (
                        <div>
                            <p>Add some products to your cart to check out!</p>
                            <Link to="/">Return to products page</Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default CartPage;