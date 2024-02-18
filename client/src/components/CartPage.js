import React from 'react';
import '../css/CartPage.css';
import CartItemCard from './CartItemCard';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { checkout } from '../API_helpers/APIHelpers';

const CartPage = () => {
    const cart = useSelector(state => state.cart);
    const auth = useSelector(state => state.auth);

    const handleCheckout = async (event) => {
        event.preventDefault();
        const user_id = auth.user_id; 
        await checkout(user_id, cart);
        // alert successful
        // clear cart in store
        // redirect to homepage
    };

    return (
        <div id='cart-page'>
            <div id='checkout-interface'>
                <p>Checkout</p>
                <form onSubmit={handleCheckout}>
                    <label>Single click checkout:</label>
                    <br></br>
                    {auth.authenticated ?
                        <input 
                            type='submit' 
                            value='Checkout!' 
                            id='checkout-button'
                            disabled={ cart.length > 0 ? false : true }
                        >
                        </input> : 
                        <Link to='/login' id='login-button'  >Login to checkout!</Link>}                    
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