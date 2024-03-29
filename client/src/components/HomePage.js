import '../css/HomePage.css';
import ProductCard from './ProductCard';
import { checkUserId, fetchAllProducts } from '../API_helpers/APIHelpers';
import { useEffect, useState } from 'react';
import store from '../store.js';
import { signalLoggedIn } from './authSlice';

function HomePage() {
  const [displayedProducts, setDisplayedProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await fetchAllProducts();
      setDisplayedProducts(productsData);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (window.location.search) {
        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);
        const queryUserId = params.get('user_id');

        const authData = await checkUserId(queryUserId);
        console.log("AUTH DATA: " + JSON.stringify(authData));
        if (authData.authenticated) {
          store.dispatch(signalLoggedIn({user_id: authData.user_id}));
        }
      }
    }
    setTimeout(checkAuthStatus, 400);
  }, [])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>The Lost Sock Emporium</h1>
        <p>The place to find single socks to replace the ones you lost.</p>
        <img src='../images/lost-sock-emporium-logo.webp' className="home-logo" alt="logo" />
        <div id='product-cards-container'>   
          {displayedProducts.map(
            product => {
              return (
                <ProductCard product={product} key={product.product_id} />
              )
            }
          )}
        </div>
      </header>
    </div>
  );
}

export default HomePage;
