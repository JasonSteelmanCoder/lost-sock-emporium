// imports and configuration

const express = require('express');
const app = express();
const db = require('./queries.js');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const PORT = (process.env.PORT || 3000);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for the Lost Sock Emporium',
        version: '1.0.0',
    },
}; 

const options = {
    swaggerDefinition,
    apis: ['./index.js']
}

const swaggerSpec = swaggerJSDoc(options);

// set up middleware

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {maxAge: 60 * 60, secure: false},
        saveUninitialized: false,
        resave: false,
        store: new pgSession({
            pool: db.pool,
            tableName: 'session',
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((user_id, done) => {
    db.deserialize(user_id, (err, user) => {
        if (err) {
            return done(err);
        };
        done(null, user);
    });
});

passport.use(
    new LocalStrategy((username, password, done) => {
        db.retrieveUser(username, async (err, user) => {
            if (err) {
                return done(err, false);
            };
            if (!user) {
                return done(null, false);
            };
            const matchedPassword = await bcrypt.compare(password, user.hashed_pw); 
            if (!matchedPassword) {
                return done(null, false);
            };
            return done(null, user);
        });
    })
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Utility endpoints

app.post('/register', (req, res, next) => {
    db.addUser(req, res, next);
});
app.post('/login', passport.authenticate("local"), (req, res, next) => {
    res.send('logged in');
});
app.get('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            throw err;
        };
    });
    res.send('logged out!');
});
app.post('/checkout', db.checkOut);

// CRUD endpoints


/**
 * @swagger
 * /products:
 *  get:
 *      summary: returns a list of all products
 *      responses: 
 *          '200': 
 *              description: A list of product objects
 *              content:
 *                  application/JSON:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  product_id:
 *                                      type: integer
 *                                      description: the product's ID
 *                                  product_name: 
 *                                      type: string
 *                                      description: the name of the product
 *                                  description: 
 *                                      type: string
 *                                      description: the customer-facing description of the product
 *                                  price:
 *                                      type: number
 *                                      description: the price of the product                                  
*/
app.get('/products', db.getAllProducts);

/**
 * @swagger
 * /products:
 *  post:
 *      summary: adds a new product to the database 'products' table
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - product_name
 *                          - description
 *                          - price
 *                      properties:
 *                          product_name:
 *                              type: string
 *                              description: The name of the product
 *                          description: 
 *                              type: string
 *                              description: The user-facing description of the product
 *                          price:
 *                              type: number
 *                              description: The price of the product in dollars, to the penny
 *      responses: 
 *          '201':
 *              description: Product created
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.post('/products', db.addProduct);

/**
 * @swagger
 * /products/:product_id:
 *  get:
 *      summary: returns a product by id
 *      responses: 
 *          '200': 
 *              description: A product object
 *              content:
 *                  application/JSON:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              product_id:
 *                                  type: integer
 *                                  description: the product's ID
 *                              product_name: 
 *                                  type: string
 *                                  description: the name of the product
 *                              description: 
 *                                  type: string
 *                                  description: the customer-facing description of the product
 *                              price:
 *                                  type: number
 *                                  description: the price of the product                                  
*/

//add error handling for wrong/missing id!
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

// Start backend

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});