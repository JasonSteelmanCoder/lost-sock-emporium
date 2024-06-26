import React from 'react';
import HomePage from './components/HomePage';
import Root from './components/Root.js';
import CartPage from './components/CartPage.js';
import LoginPage from './components/LoginPage.js';
import RegistrationPage from './components/RegistrationPage.js';
import ProductPage from './components/ProductPage.js';
import LoadingPage from './components/LoadingPage.js';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter } from 'react-router-dom';
import OrderHistory from './components/OrderHistory.js';

const appRouter = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route index element={<HomePage />} />
    <Route path='/cart' element={<CartPage />} />
    <Route path='/login' element={<LoginPage />} />
    <Route path='/register' element={<RegistrationPage />} />
    <Route path='/products/:product_id' element={<ProductPage />} />
    <Route path='/loading' element={<LoadingPage />} />
    <Route path='/history' element={<OrderHistory />} />
  </Route>
))

const App = () => {

  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
