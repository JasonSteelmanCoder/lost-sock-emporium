import react from 'react';
import logoImage from '../images/lost-sock-emporium-logo.jpg';
import cartImage from '../images/shopping_cart_emblem.png';
import '../css/Root.css';
import { Outlet } from 'react-router-dom';

const Root = () => {

    return (
        <div>
            <nav>
                <div id='logo-container'>
                    <img src={logoImage} id='logo'></img>
                </div>
                <img src={cartImage} id='cart-image'></img>
                <a id='login-button'>Login</a>
            </nav>
            <Outlet />
        </div>
    )
}

export default Root;