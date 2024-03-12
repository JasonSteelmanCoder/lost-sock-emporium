import lostSockEmporiumLogo from '../images/lost-sock-emporium-logo.jpg';
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
      const authStatus = await checkUserId()
      console.log("AUTH STATUS: " + JSON.stringify(authStatus));
      if (authStatus.authenticated) {
        store.dispatch(signalLoggedIn());
      }
    }
    checkAuthStatus();
  }, [])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>The Lost Sock Emporium</h1>
        <p>The place to find single socks to replace the ones you lost.</p>
        <img src={lostSockEmporiumLogo} className="home-logo" alt="logo" />
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
