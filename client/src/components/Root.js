import react from 'react';
import logoImage from '../images/lost-sock-emporium-logo.jpg';
import cartImage from '../images/shopping_cart_emblem.png';
import '../css/Root.css';
import { Outlet, Link } from 'react-router-dom';

const Root = () => {

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
                <Link to={'login'} id='login-button'>Login</Link>
            </nav>
            <Outlet />
        </div>
    )
}

export default Root;