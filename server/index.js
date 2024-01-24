const express = require('express');
const app = express();

const PORT = (process.env.PORT || 6000);


app.get('/products', (req, res, next) => {
    
});

app.get('/products/:product-id', (req, res, next) => {

});

app.put('/products/:product-id', (req, res, next) => {

});

app.delete('/products/:product-id', (req, res, next) => {

});

app.get('/orders', (req, res, next) => {

});

app.post('/orders', (req, res, next) => {

});

app.put('/orders', (req, res, next) => {

});

app.get('/orders/:order-id', (req, res, next) => {

});

app.put('/orders/:order-id', (req, res, next) => {

});

app.delete('/orders/:order-id', (req, res, next) => {

});

app.get('/users', (req, res, next) => {

});

app.post('/users', (req, res, next) => {

});

app.get('/users/:user-id', (req, res, next) => {

});

app.put('/users/:user-id', (req, res, next) => {

});

app.delete('/users/:user-id', (req, res, next) => {

});




app.listen(PORT);