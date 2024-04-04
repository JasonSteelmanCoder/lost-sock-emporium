import React, { useEffect, useState } from 'react';
import '../css/CartPage.css';
import CartItemCard from './CartItemCard';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { checkout } from '../API_helpers/APIHelpers';
import { emptyCart } from './cartSlice';
import store from '../store.js';
import { useNavigate } from 'react-router-dom';
import { fetchProductById } from '../API_helpers/APIHelpers';

const CartPage = () => {
    const cart = useSelector(state => state.cart);
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [subtotal, setSubtotal] = useState(null);

    useEffect(() => {
        const findSubtotal = async () => {
            let accumulator = 0;
            for (let cartItem of cart) {
                const product = await fetchProductById(cartItem.product_id);
                const rawProductPrice = product.price;
                // product price has money datatype in the database, so we slice to remove the dollar sign.
                const productPrice = Number(rawProductPrice.slice(1));
                const itemPrice = productPrice * Number(cartItem.quantity);
                accumulator += itemPrice;
            }
            setSubtotal(accumulator.toFixed(2));
        }

        findSubtotal();
    }, [cart]);

    const handleCheckout = async (event) => {
        event.preventDefault();
        const user_id = auth.user_id; 
        const response = await checkout(user_id, cart);
        if (response.status === 201) {
            alert("Order successfully placed!");
            store.dispatch(emptyCart());
            navigate('/');
        } else {
            alert("There was a problem placing the order.");
        }
    };

    return (
        <div id='cart-page'>
            <div id='checkout-interface'>
                <div>
                    <p id='subtotal' className='edge'>Subtotal: ${subtotal}</p>
                </div>
                <form onSubmit={handleCheckout} id='checkout form'>
                    <label id='checkout-label' className='edge'>Single click checkout:</label>
                    <br></br>
                    {auth.authenticated ?
                        <input 
                            type='submit' 
                            value='Checkout!' 
                            id='checkout-button'
                            disabled={ cart.length > 0 ? false : true }
                        >
                        </input> : 
                        (
                            <div>
                                <br></br>
                                <Link to='/login?return=cart' id='login-button' className='dark-bg-link' >Login to checkout!</Link>
                            </div>
                        )
                    }
                    <p id='disclaimer'>*This site is for demonstration only. We will not actually send you a sock (though we wish you luck finding yours).</p>
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
                        <div className='edge'>
                            <p>Add some products to your cart to check out!</p>
                            <Link to="/" className='blue-link dark-bg-link' >Return to products page</Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default CartPage;