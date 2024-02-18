import react from 'react';
import logoImage from '../images/lost-sock-emporium-logo.jpg';
import cartImage from '../images/shopping_cart_emblem.png';
import '../css/Root.css';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logout } from '../API_helpers/APIHelpers';
import store from '../store.js';
import { signalLoggedOut } from './authSlice';

const Root = () => {
    const loggedIn = useSelector(store => store.auth.authenticated);

    const handleLogOut = async (event) => {
        await logout();
        alert('Logged out successfully!');
        store.dispatch(signalLoggedOut());
    };

    return (
        <div>
            <nav>
                <div id='logo-container'>
                    <Link to={'/'} >
                        <img src={logoImage} id='logo'></img>
                    </Link>
                </div>
                <Link to={'cart'} >
                    <img src={cartImage} id='cart-image'></img>
                </Link>
                {loggedIn ? <button id='root-logout-button' onClick={handleLogOut}>Logout</button> : <Link to={'login'} id='root-login-button'>Login</Link> }
            </nav>
            <Outlet />
        </div>
    )
}

export default Root;