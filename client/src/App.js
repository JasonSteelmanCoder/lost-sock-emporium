import React from 'react';
import HomePage from './components/HomePage';
import Root from './components/Root.js';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter } from 'react-router-dom';

const appRouter = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Root />}>
    <Route index element={<HomePage />} />
  </Route>
))

const App = () => {

  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
