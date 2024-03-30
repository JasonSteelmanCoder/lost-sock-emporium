import react from 'react';
import logoImage from '../images/lost-sock-emporium-logo.webp';
import cartImage from '../images/shopping_cart_emblem.png';
import '../css/Root.css';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from '../API_helpers/APIHelpers';
import store from '../store.js';
import { signalLoggedOut } from './authSlice';
import { emptyCart } from './cartSlice.js';

const Root = () => {
    const loggedIn = useSelector(store => store.auth.authenticated);
    const cart = useSelector(store => store.cart)

    const handleLogOut = async (event) => {
        await logout();
        alert('Logged out successfully!');
        store.dispatch(signalLoggedOut());
        store.dispatch(emptyCart());
    };

    return (
        <div>
            <nav>
                <div id='logo-container'>
                    <Link to={'/'} >
                        <img src={logoImage} id='logo' alt='sock emporium logo' ></img>
                    </Link>
                </div>
                <Link to={'history'} id='root-history-button' >
                    Orders
                </Link>
                <Link to={'cart'} id='root-cart-button' style={{'--cart-length': `"${cart.length}"`, '--show-notification': `${cart.length > 0 ? 1 : -1}`}} >
                    <img src={cartImage} id='cart-image' alt='cart icon' ></img>
                </Link>
                {loggedIn ? <button id='root-logout-button' onClick={handleLogOut}>Logout</button> : <Link to={'login'} id='root-login-button'>Login</Link> }
            </nav>
            <Outlet />
        </div>
    )
}

export default Root;