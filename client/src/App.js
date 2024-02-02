import lostSockEmporiumLogo from './lost-sock-emporium-logo.jpg';
import './App.css';
import ProductCard from './components/ProductCard';
import { fetchAllProducts } from './API_helpers/APIHelpers';
import { useState, useEffect } from 'react';

function App() {
  const [ products, setProducts ] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await fetchAllProducts();
      setProducts(productsData);
    }

    fetchProducts();
  }, []);
  return (
    <div className="App">
      <header className="app-header">
        <h1>The Lost Sock Emporium</h1>
        <p>The place to find single socks to replace the ones you lost.</p>
        <img src={lostSockEmporiumLogo} className="app-logo" alt="logo" />
        <div id='product-cards-container'>
          {products.map(
            product => {
              return (
                <ProductCard product={product.product_name} />
              )
            }
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
