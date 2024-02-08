import react from 'react';
import logoImage from '../images/lost-sock-emporium-logo.jpg';
import cartImage from '../images/shopping_cart_emblem.png';
import '../css/NavBar.css';

const NavBar = () => {

    return (
        <nav>
            <div id='logo-container'>
                <img src={logoImage} id='logo'></img>
            </div>
            <img src={cartImage} id='cart-image'></img>
            <a id='login-button'>Login</a>
        </nav>
    )
}

export default NavBar;