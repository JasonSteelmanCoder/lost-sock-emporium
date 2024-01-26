const express = require('express');
const app = express();
const db = require('./queries.js');

const PORT = (process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/products', db.getAllProducts);
app.post('/products', db.addProduct);
app.get('/products/:product_id', db.getProductById);
app.put('/products/:product_id', db.updateProductById);
app.delete('/products/:product_id', db.deleteProductById);

app.get('/orders', db.getAllOrders);
app.post('/orders', db.addOrder);
app.get('/orders/:order_id', db.getOrderById);
app.put('/orders/:order_id', db.updateOrderById);
app.delete('/orders/:order_id', db.deleteOrderById);

app.get('/users', db.getAllUsers);
app.post('/users', db.addUser);
app.get('/users/:user_id', db.getUserById);
app.put('/users/:user_id', db.updateUserById);
app.delete('/users/:user_id', db.deleteUserById);

app.get('/ordered_products', db.getAllOrderedProducts);
app.post('/ordered_products', db.addOrderedProduct);
app.get('/ordered_products/:order_id/:product_id', db.getOrderedProductById);
app.put('/ordered_products/:order_id/:product_id', db.updateOrderedProductById);
app.delete('/ordered_products/:order_id/:product_id', db.deleteOrderedProductById);

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});