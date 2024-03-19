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
const cors = require('cors');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

const PORT = (process.env.PORT || 3001);

const allowedOrigins = ['https://lost-sock-emporium.onrender.com', 'http://localhost:3000', 'https://accounts.google.com'];

const corsOptions = {
    origin:(origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {maxAge: 60 * 60, secure: true, state: Math.floor(Math.random() * 1000000000)},
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
    console.log("DESERIALIZING!");
    db.deserialize(user_id, (err, user) => {
        if (err) {
            return done(err);
        };
        return done(null, user);
    });
});

passport.use(
    new LocalStrategy((username, password, done) => {
        const cleanedUsername = username.trim().toLowerCase();
        db.retrieveUser(cleanedUsername, async (err, user) => {
            if (err) {
                return done(err, false, {message: err});
            };
            if (!user) {
                return done(null, false, {message: "Username or password is incorrect"});
            };
            const matchedPassword = await bcrypt.compare(password, user.hashed_pw); 
            if (!matchedPassword) {
                return done(null, false, {message: "Username or password is incorrect"});
            };
            return done(null, user);
        });
    })
);

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://lost-sock-emporium-backend.onrender.com/auth/google/callback",
        passReqToCallback: true,
    },
    async function(request, accessToken, refreshToken, profile, cb) {
        await db.findOrCreateGoogleUser({ googleId: profile.id, name: profile.email }, 
        function (err, user) {
            if (err) {
                return cb(err);
            };
            if (!user) {
                return cb(null, false);
            };
            return cb(null, user);
        });
    })
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Utility endpoints


/**
 * @swagger
 * /register:
 *  post:
 *      summary: Register a new user
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: 
 *                          - username
 *                          - password
 *                      properties: 
 *                          username: 
 *                              type: string
 *                              description: the new user's username
 *                          password:
 *                              type: string
 *                              description: the new user's password
 *      responses: 
 *          '201':
 *              description: new user object created successfully
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '400':
 *              description: Username already exists or username includes special character
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '401':
 *              description: Username or password is missing
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
*/
app.post('/register', (req, res, next) => {
    db.addUser(req, res, next);
});

/**
 * @swagger
 * /login:
 *  post:
 *      summary: login with a username and password
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required: 
 *                          - username
 *                          - password
 *                      properties: 
 *                          username: 
 *                              type: string
 *                              description: the username for the user logging in
 *                          password:
 *                              type: string
 *                              description: the password for the user logging in
 *                      
 *      responses:
 *          '200':
 *              description: Login successful.
 *              content: 
 *          '400':
 *              description: Bad request. Correct username and password required.
 *              content: 
 *          '401':
 *              description: Unauthorized. Password incorrect. 
 *              content: 
*/
app.post('/login', passport.authenticate("local"), (req, res, next) => {
    res.json({
        user_id: req.user.user_id
    });
});

app.get('/auth/google', (req, res, next) => {
    req.session.oauthState = req.session.cookie.state;
    passport.authenticate(
        'google', { scope: ['email', 'profile'], state: req.session.cookie.state }
    ) (req, res, next);
});

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: 'https://lost-sock-emporium.onrender.com/login',
    failureFlash: true,
    successFlash: true
}), 
    function(req, res) {
        res.cookie('user_id', req.session.passport.user, {httpOnly: true, secure: true, domain: '.onrender.com'})
        res.redirect("https://lost-sock-emporium.onrender.com");
    }
)

/**
 * @swagger
 * /login:
 *  get:
 *      summary: check if a user is logged in
 *      responses:
 *          '200':
 *              description: user was checked
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              authenticated:
 *                                  type: boolean
 *                                  description: true if the user is logged in, false if not
 *                              
*/
app.get('/login', (req, res, next) => {
    // console.log('REQ SESSION: ' + JSON.stringify(req.session));
    // console.log('REQ ISLOGGEDIN: ' + req.isLoggedIn);
    console.log("COOKIES" + JSON.stringify(req.session.cookie));
    const user_id = req.session.passport && req.session.passport.user ? req.session.passport.user : null; 
    res.json({
        "authenticated": req.isAuthenticated(),
        "user_id": user_id
    });
});

/**
 * @swagger
 * /logout:
 *  get:
 *      summary: log a user out
 *      responses:
 *          '200':
 *              description: logout successful
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: string
 *          '500':
 *              description:
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: string
*/
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            res.status(500).json('server-side error');
        } else {
            res.json('logged out!');
        };
    }); 
});

/**
 * @swagger
 * /checkout:
 *  post:
 *      summary: Check out with the products in your cart. A new order object is inserted into the orders table and new ordered_products objects are inserted into the ordered_products table.
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - user_id
 *                          - cart
 *                      properties:
 *                          user_id: 
 *                              type: integer
 *                              description: the user_id of the user who is checking out
 *                          cart:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      product_id:
 *                                          type: integer
 *                                          description: the id of the product type that is being ordered
 *                                      quantity:
 *                                          type: integer
 *                                          description: the number of the product that the user is ordering
 *                                  description: an object representing an ordered_product
 *      responses:
 *          '201':
 *              description: Checkout successful. The new order and ordered_products have been inserted into their tables.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '404':
 *              description: user_id not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string 
 *          '400':
 *              description: The cart or user_id properties of the request body are incorrect.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.post('/checkout', db.checkout);


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
 *          '500':
 *              description: server-side error
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string 
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
 *          '400':
 *              description: request price is not a number or request body is missing product_name, description, or price properties
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string 
 *          '500':
 *              description: server-side error
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
 *      parameters: 
 *          - in: path
 *            name: product_id
 *            required: true
 *            schema: 
 *                type: integer
 *            description: the product_id corresponding to the product to be retrieved
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
 *          '404':
 *              description: Product not found for that id
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string 
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string 
*/
app.get('/products/:product_id', db.getProductById);

/**
 * @swagger
 * /products/:product_id:
 *  put:
 *      summary: updates selected properties of product by id
 *      parameters: 
 *          - in: path
 *            name: product_id
 *            required: true
 *            schema:
 *                type: integer
 *            description: the product_id for the product to be updated
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
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
 *          '200':
 *              description: Product updated!
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '400':
 *              description: Price is not a number, or the request body is blank
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: Internal server error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.put('/products/:product_id', db.updateProductById);

/**
 * @swagger
 * /products/:product_id:
 *  delete:
 *      summary: delete a product with a certain id
 *      parameters:
 *          - in: path
 *            name: product_id
 *            required: true
 *            schema:
 *                type: integer
 *            description: the product_id of the product to be deleted
 *      responses: 
 *          '204': 
 *              description: product is deleted or did not exist
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500': 
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.delete('/products/:product_id', db.deleteProductById);


/**
 * @swagger
 * /orders:
 *  get:
 *      summary: get all orders from the orders table
 *      responses:
 *          '200':
 *              description: json array of order objects
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              type: object
 *                              properties: 
 *                                  order_id:
 *                                      type: integer
 *                                      description: the id of the order 
 *                                  user_id:
 *                                      type: integer
 *                                      description: the id of the user who made the order 
 *          '500': 
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.get('/orders', db.getAllOrders);

/**
 * @swagger
 * /orders:
 *  post:
 *      summary: add a new order object to the orders table
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema: 
 *                      type: object
 *                  properties:
 *                      user_id:
 *                          type: integer
 *                          description: the user_id of the user making the order
 *      responses:
 *          '201':
 *              description: new order object added to the orders table
 *              content:
 *                  type: 
 *                      text/plain:
 *                          schema:
 *                              type: string
 *          '404':
 *              description: the user_id in the request is not found.
 *              content:
 *                  type:
 *                      text/plain:
 *                          schema:
 *                              type: string
 *          '500':
 *              description: server-side error
 *              content:
 *                  type:
 *                      text/plain:
 *                          schema:
 *                              type: string
*/
app.post('/orders', db.addOrder);


/**
 * @swagger
 * /orders/:order_id:
 *  get:
 *      summary: get a single order by its order_id
 *      parameters:
 *          - in: path
 *            name: order_id
 *            required: true
 *            schema:
 *                type: integer
 *            description: the order_id of the order to retrieve
 *      responses:
 *          '200':
 *              description: order object in json format
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              order_id:
 *                                  type: integer
 *                                  description: the id of the order
 *                              user_id:
 *                                  type: integer
 *                                  description: the id of the user who placed the order                  
 *          '404':
 *              description: order not found with the order_id provided
 *              content: 
 *                  text/plain:
 *                      schema: 
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 * 
*/
app.get('/orders/:order_id', db.getOrderById);

/**
 * @swagger
 * /orders/:order_id:
 *  put:
 *      summary: update the user_id of an order by order_id
 *      parameters:
 *          - in: path
 *            name: order_id
 *            required: true
 *            schema: 
 *                type: integer
 *            description: the order_id of the order to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                  properties:
 *                      user_id:
 *                          type: integer
 *                          description: new user_id for the order
 *      responses:
 *          '200':
 *              description: order updated
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '404':
 *              description: user_id or order_id not found
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.put('/orders/:order_id', db.updateOrderById);

/**
 * @swagger
 * /orders/:order_id:
 *  delete:
 *      summary: delete an order by its order_id
 *      parameters:
 *          - in: path
 *            name: order_id
 *            required: true
 *            schema:
 *              type: integer
 *            description: the id of the order to delete
 *      responses: 
 *          '204':
 *              description: the order is deleted or does not exist
 *              content:
 *                  text/plain:
 *                      schema: 
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.delete('/orders/:order_id', db.deleteOrderById);

/**
 * @swagger
 * /users:
 *  get:
 *      summary: get all user objects from the users database
 *      responses: 
 *          '200':
 *              description: json array of user objects
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: array
 *                          items: 
 *                              type: object
 *                              properties: 
 *                                  user_id:
 *                                      type: integer
 *                                      description: the id of the user
 *                                  username: 
 *                                      type: string
 *                                      description: the user's username
 *                                  hashed_pw: 
 *                                      type: string
 *                                      description: the hash of the user's password
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.get('/users', db.getAllUsers);

/**
 * @swagger
 * /users:
 *  post:
 *      summary: add a new user object to the users table
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                  properties:
 *                      username: 
 *                          type: string
 *                          description: the new user's username
 *                      password:
 *                          type: string
 *                          description: the new user's password
 *      responses:
 *          '201':
 *              description: new user object has been added to the users table
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '400':
 *              description: username already exists
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type:string
 *          '401':
 *              description: request is missing username or password
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.post('/users', db.addUser);

/**
 * @swagger
 * /users/:user_id:
 *  get:
 *      summary: get a single user by user_id
 *      parameters:
 *          - in: path
 *            name: user_id
 *            required: true
 *            schema: 
 *              type: string
 *            description: the user_id of the user object to retrieve
 *      responses:
 *          '200':
 *              description: returns json object for the user matching the user_id
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user_id: 
 *                                  type: integer
 *                                  description: the user_id for the retrieved user object
 *                              username: 
 *                                  type: string
 *                                  description: the username for the retrieved user
 *                              hashed_pw: 
 *                                  type: string
 *                                  description: the hash of the user's password
 *          '404':
 *              description: user not found for given user_id
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.get('/users/:user_id', db.getUserById);

/**
 * @swagger
 * /users/:user_id:
 *  put:
 *      summary: update a user's account by user_id
 *      parameters:
 *          - in: path
 *            name: user_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the user_id that corresponds with the user to update
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                  properties: 
 *                      username:
 *                          type: string
 *                          description: the new username for the updated user
 *      responses:
 *          '200':
 *              description: user updated 
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '400':
 *              description: username not included in the body of the request 
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '404':
 *              description: user not found for the given user_id 
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error 
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.put('/users/:user_id', db.updateUserById);

/**
 * @swagger
 * /users/:user_id:
 *  delete:
 *      summary: delete user by id
 *      parameters:
 *          - in: path
 *            name: user_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the user_id of the user object to be deleted
 *      responses:
 *          '204':
 *              description: the user was deleted or didn't exist 
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.delete('/users/:user_id', db.deleteUserById);

/**
 * @swagger
 * /ordered_products:
 *  get:
 *      summary: get all ordered_products from the ordered_products table
 *      responses:
 *          '200':
 *              description: a json array of ordered_product objects
 *              content:
 *                  application/json:
 *                      schema:          
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties: 
 *                                  order_id:   
 *                                      type: integer
 *                                      description: the id of the order that these ordered_products belong to
 *                                  product_id:
 *                                      type: integer
 *                                      description: the id of the product type required by the order
 *                                  quantity:
 *                                      type: integer
 *                                      description: the quantity of the product that is required by the order 
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.get('/ordered_products', db.getAllOrderedProducts);

/**
 * @swagger
 * /ordered_products:
 *  post: 
 *      summary: Add a new ordered_product object to the ordered_products table. Note that the ordered product cannot duplicate an ordered product already assigned to the requested order_id.
 *      requestBody: 
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                  properties:
 *                      order_id:   
 *                          type: integer
 *                          description: the id of the order that these ordered_products belong to
 *                      product_id:
 *                          type: integer
 *                          description: the id of the product type required by the order
 *                      quantity:
 *                          type: integer
 *                          description: the quantity of the product that is required by the order 
 *      responses:
 *          '201':
 *              description: ordered_product object is added to orded_products table
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '404':
 *              description: the order_id or product_id in the request was not found
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '400':
 *              description: bad request
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.post('/ordered_products', db.addOrderedProduct);

/**
 * @swagger
 * /ordered_products/:order_id/:product_id:
 *  get:
 *      summary: Get a single ordered_product by its composite key, which is made up of order_id, and product_id. 
 *      parameters: 
 *          - in: path
 *            name: order_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the order_id of the order that the ordered_product belongs to
 *          - in: path
 *            name: product_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the product_id of the type of product requested in the order
 *      responses:
 *          '200':
 *              description: a json object representing an ordered_product
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              order_id:
 *                                  type: integer
 *                                  description: the order_id of the order that these products go to
 *                              product_id: 
 *                                  type: integer
 *                                  description: the product_id of the type of product that was ordered
 *                              quantity: 
 *                                  type: integer
 *                                  description: how many of the product are required for the order
 *          '404':
 *              description: ordered_product not found with that combination of order_id and product_id
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.get('/ordered_products/:order_id/:product_id', db.getOrderedProductById);

/**
 * @swagger
 * /ordered_products/:order_id/:product_id:
 *  put:
 *      summary: change the quantity of an ordered_product, identified by its order_id and product_id
 *      parameters:
 *          - in: path
 *            name: order_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the order_id of the order that the ordered_product belongs to
 *          - in: path
 *            name: product_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the product_id of the type of product requested in the order
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                  properties:
 *                      quantity:
 *                          type: integer
 *                          description: the revised number of items required by the order
 *      responses:
 *          '200':
 *              description: order updated
 *              content:
 *                  text/plain:
 *                      schema: 
 *                          type: string
 *          '404':
 *              description: ordered_product not found with that combination of order_id and product_id
 *              content:
 *                  text/plain:
 *                      schema: 
 *                          type: string
 *          '400':
 *              description: request body must be a json object with a number assigned to the quantity property
 *              content:
 *                  text/plain:
 *                      schema: 
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content:
 *                  text/plain:
 *                      schema: 
 *                          type: string
*/
app.put('/ordered_products/:order_id/:product_id', db.updateOrderedProductById);

/**
 * @swagger
 * /ordered_products/:order_id/:product_id:
 *  delete:
 *      summary: delete an ordered_product from the products table, identified by its order_id and product_id
 *      parameters:
 *          - in: path
 *            name: order_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the order_id of the order that the ordered_product belongs to
 *          - in: path
 *            name: product_id
 *            required: true
 *            schema: 
 *              type: integer
 *            description: the product_id of the type of product requested in the order
 *      responses:
 *          '204':
 *              description: ordered_product deleted or did not exist
 *              content: 
 *                  text/plain:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: server-side error
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
*/
app.delete('/ordered_products/:order_id/:product_id', db.deleteOrderedProductById);

app.get('/images/:image_name', db.getImage);

// spin up backend

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});