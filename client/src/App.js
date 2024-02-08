import lostSockEmporiumLogo from './images/lost-sock-emporium-logo.jpg';
import './css/App.css';
import ProductCard from './components/ProductCard';
import { fetchAllProducts } from './API_helpers/APIHelpers';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populateProducts } from './components/displayedProductsSlice';
import NavBar from './components/NavBar';

function App() {
  const displayedProducts = useSelector((state) => state.displayedProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await fetchAllProducts();
      dispatch(populateProducts(productsData));
    }
    fetchProducts();
  }, []);
  return (
    <div className="App">
      <header className="app-header">
        <NavBar />
        <h1>The Lost Sock Emporium</h1>
        <p>The place to find single socks to replace the ones you lost.</p>
        <img src={lostSockEmporiumLogo} className="app-logo" alt="logo" />
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

export default App;
