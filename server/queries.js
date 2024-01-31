// Imports
require('dotenv').config();
const bcrypt = require('bcrypt');

// Set up pool to access database
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST, 
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT
});

const deserialize = (user_id, cb) => {
    pool.query(
        'SELECT * FROM users WHERE user_id = $1',
        [user_id],
        (err, results) => {
            cb(err, results.rows[0]); 
        }
    );
};

// Check the database for a user's existence. Used by passport's local strategy in index.js.
const retrieveUser = (username, cb) => {
    pool.query(
        'SELECT * FROM users WHERE username = $1;',
        [username],
        (err, results) => {
            cb(err, results.rows[0]);  
        }
    );
};


// Create new order with corresponding ordered_products when a user checks out.
const checkOut = async (req, res, next) => {
    // look up user_id in database
    const userIdCheck = await pool.query(
        'SELECT * FROM users WHERE user_id = $1;',
        [req.body.user_id]
    );
    // look up cart items in database
    const checkProductsExist = async () => {
        for (let ordered_product of req.body.cart) {
            const productReport = await pool.query(
                'SELECT EXISTS (SELECT 1 FROM products WHERE product_id = $1)',
                [ordered_product.product_id]
            );
            if (!productReport.rows[0].exists) {
                return false;
            };
        };
        return true;
    };
    // Check that request body has a valid user_id and a non-empty cart
    if (!userIdCheck.rows[0] || !req.body.cart || req.body.cart.length === 0) {
        res.status(400).send("Bad request: cart or user_id is incorrect");
    } else if (!await checkProductsExist()) {
        res.status(400).send("Bad request: product ids are incorrect");
    } else {
        try {
            const orderResults = await pool.query(
                'INSERT INTO orders (user_id) VALUES ($1) RETURNING order_id;',      // return the order_id of the new order. You'll need it to add ordered products.
                [req.body.user_id]
            );
            for (let ordered_product of req.body.cart) {
                pool.query(
                    'INSERT INTO ordered_products (order_id, product_id, quantity) VALUES ($1, $2, $3);',
                    [orderResults.rows[0].order_id, ordered_product.product_id, ordered_product.quantity],
                    (err, results) => {
                        if (err) {
                            throw err;
                        };
                    }
                )
            };
            res.status(201).send('Your order has been created!');
        } catch (err) {
            throw err;
        }
    };
};

const getAllProducts = (req, res, next) => {
    pool.query(
        "SELECT * FROM products;", 
        (err, results) => {
        if (err) {
            throw err;
        } else {
            res.status(200).json(results.rows);
        }
    });
};

const addProduct = (req, res, next) => {
    pool.query(
        'INSERT INTO products (product_name, description, price) VALUES ($1, $2, $3);',
        [req.body.product_name, req.body.description, req.body.price],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(201).send('product created!');
        }
    );
};

const getProductById = (req, res, next) => {
    pool.query(
        'SELECT * FROM products WHERE product_id = $1;', 
        [req.params.product_id], 
        (err, results) => {
            if (err) {
                throw err;
            } else if (!results.rows[0]) {
                res.status(404).send('Product not found with that id.');
            } else {
                res.send(results.rows);
            };
    });
};

const updateProductById = async (req, res, next) => {
    // All fields that are named in req.body are updated in database.
    // Fields missing from req.body are left alone.
    let isUpdated = false;
    try {
        if (req.body.product_name) {
            await pool.query(
                'UPDATE products SET product_name = $1 WHERE product_id = $2;', 
                [req.body.product_name, req.params.product_id]
            );
            isUpdated = true;
        };
        if (req.body.description) {
            await pool.query(
                'UPDATE products SET description = $1 WHERE product_id = $2;',
                [req.body.description, req.params.product_id]
            );
            isUpdated = true;
        }
        if (typeof(req.body.price) === "number") {
            await pool.query(
                'UPDATE products SET price = $1 WHERE product_id = $2;',
                [req.body.price, req.params.product_id]
            );
            isUpdated = true;
        } else if (req.body.price) {
            res.status(400).send('Price must be a number.');
        };

        if (isUpdated) {
            res.send('Product updated!');
        } else {
            res.status(400).send('At least one property must be included to update.')
        }

    } catch (err) {
        res.status(500).send('Internal Server Error');
    };
};

const deleteProductById = (req, res, next) => {
    pool.query(
        'DELETE FROM products WHERE product_id = $1;',
        [req.params.product_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(204).send('No content');
        }
    );
};

const getAllOrders = (req, res, next) => {
    pool.query(
        'SELECT * FROM orders;',
        (err, results) => {
            if (err) {
                throw err;
            };
            res.json(results.rows);
        }
    )
};

const addOrder = (req, res, next) => {
    pool.query(
        'INSERT INTO orders (user_id) VALUES ($1);',
        [req.body.user_id],
        (err, results) => {
            if (err && err.code === '23503') {
                res.status(404).send('user_id must be an integer corresponding to an existing user.');
            } else if (err) {
                res.status(500).send('There was an error.');
            } else {
                res.status(201).send('order added!')
            };
        }
    );
};

const getOrderById = (req, res, next) => {
    pool.query(
        'SELECT * FROM orders WHERE order_id = $1',
        [req.params.order_id],
        (err, results) => {
            if (err) {
                res.status(500).send();
            };
            if (results.rows[0]) {
                res.json(results.rows[0]);
            } else {
                res.status(404).send('Order not found with that order_id.');
            };
        }
    );
};

const updateOrderById = async (req, res, next) => {
    if (req.body.user_id) {
        try {
            const results = await pool.query(
                'UPDATE orders SET user_id = $1 WHERE order_id = $2 RETURNING order_id',
                [req.body.user_id, req.params.order_id]
            );
            if (results.rows[0]){
                res.send('order updated!');
            } else {
                res.status(404).send('order not found for that order_id');
            }
        } catch (err) {
            if (err.code === '23503') {
                res.status(404).send('user_id not found');
            } else {
                res.status(500).send('server-side error');
            }
        };
    };
};

const deleteOrderById = (req, res, next) => {
    pool.query(
        'DELETE FROM orders WHERE order_id = $1;',
        [req.params.order_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(204).send('order deleted!');
        }
    );
};

const getAllUsers = (req, res, next) => {
    pool.query(
        'SELECT * FROM users;',
        (err, results) => {
            if (err) {
                throw err;
            };
            res.json(results.rows);
        }
    )
};

const addUser = async(req, res, next) => {
    // Check that username does not already exist
    const usernameExists = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [req.body.username]
    )
    if (usernameExists.rows[0]) {
        res.status(400).send('Username already exists!');
    } else if (req.body.username && req.body.password) {            // check that username & password are both included 
        const salt = await bcrypt.genSalt(10);
        const hashed_pw = await bcrypt.hash(req.body.password, salt);
        pool.query(
            'INSERT INTO users (username, hashed_pw) VALUES ($1, $2);',
            [req.body.username, hashed_pw], 
            (err, results) => {
                if (err) {
                    throw err;
                };
                res.status(201).send('user added!');
            }
        )
    } else {
        res.status(401).send('Username and password are both required.');
    };     
};

const getUserById = (req, res, next) => {
    pool.query(
        'SELECT * FROM users WHERE user_id = $1;',
        [req.params.user_id],
        (err, results) => {
            if (err) {
                res.status(500).send('server-side error');
            } else if (!results.rows[0]) {
                res.status(404).send('user not found for that user_id')
            } else {
                res.json(results.rows[0]);
            }
        }
    );
};

const updateUserById = async (req, res, next) => {
    if (req.body.username) {
        try {
            const results = await pool.query(
                'UPDATE users SET username = $1 WHERE user_id = $2 RETURNING user_id',
                [req.body.username, req.params.user_id]
            );
            if (!results.rows[0]) {
                res.status(404).send('no user found for that user_id');
            } else {
                res.send('user updated!')
            }
        } catch (err) {
            res.status(500).send('server-side error');
        };
    } else {
        res.status(400).send('new username must be included in body of request');
    }
};

const deleteUserById = (req, res, next) => {
    pool.query(
        'DELETE FROM users WHERE user_id = $1',
        [req.params.user_id],
        (err, results) => {
            if (err) {
                res.status(500).send('server-side error')
            } else {
                res.status(204).send('user deleted!');
            };
        }
    );
};

const getAllOrderedProducts = (req, res, next) => {
    pool.query(
        'SELECT * FROM ordered_products;',
        (err, results) => {
            if (err) {
                throw err;
            };
            res.json(results.rows);
        }
    );
};

const addOrderedProduct = async (req, res, next) => {
    if (req.body.order_id && req.body.product_id && req.body.quantity) {
        pool.query(
            'INSERT INTO ordered_products VALUES ($1, $2, $3);',
            [req.body.order_id, req.body.product_id, req.body.quantity],
            (err, results) => {
                if (err && err.code === '23505') {
                    res.status(400).send('this order already exists')   // no duplicate orders allowed (may change in future.)
                } else if (err && err.code === '23503') {
                    res.status(404).send('the order_id or product_id in the request does not exist');
                } else if (err) {
                    res.status(500).json(err);
                } else if (err && err.code === '22P02') {
                    res.status(400).send('quantity must be an integer')
                } else {
                    res.status(201).send('ordered_product added!');
                }
            }
        );
    } else {
        res.status(400).send('order_id, product_id, and quantity must all be included in the request body.');
    }
};

const getOrderedProductById = (req, res, next) => {
    pool.query(
        'SELECT * FROM ordered_products WHERE order_id = $1 AND product_id = $2;',
        [req.params.order_id, req.params.product_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.json(results.rows);
        }
    );
};

const updateOrderedProductById = (req, res, next) => {
    pool.query(
        'UPDATE ordered_products SET quantity = $1 WHERE order_id = $2 AND product_id = $3;',
        [req.body.quantity, req.params.order_id, req.params.product_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.send('ordered_products updated!');
        }
    );
};

const deleteOrderedProductById = (req, res, next) => {
    pool.query(
        'DELETE FROM ordered_products WHERE order_id = $1 AND product_id = $2;',
        [req.params.order_id, req.params.product_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(204).send('ordered_product deleted!');
        }
    );
};

module.exports = {
    pool,           // used to set up session in index.js
    deserialize,       // used by passport in index.js
    retrieveUser,        //used by passport in index.js
    checkOut,       // coordinates posting to both orders and ordered_products
    getAllProducts,
    addProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getAllOrders,
    addOrder,
    getOrderById,
    updateOrderById,
    deleteOrderById,
    getAllUsers,
    addUser,
    getUserById,
    updateUserById,
    deleteUserById,
    getAllOrderedProducts,
    addOrderedProduct,
    getOrderedProductById,
    updateOrderedProductById,
    deleteOrderedProductById,
};