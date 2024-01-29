const express = require('express');
const app = express();
const db = require('./queries.js');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const PORT = (process.env.PORT || 3000);

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
    db.deserializer(user_id, (err, user) => {
        if (err) {
            return done(err);
        };
        done(null, user);
    });
});

passport.use(
    new LocalStrategy((username, hashed_pw, done) => {
        db.passwordChecker(username, (err, user) => {
            if (err) {
                return done(err, false);
            };
            if (!user) {
                return done(null, false);
            };
            if (user.hashed_pw != hashed_pw) {
                return done(null, false);
            };
            return done(null, user);
        });
    })
);

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