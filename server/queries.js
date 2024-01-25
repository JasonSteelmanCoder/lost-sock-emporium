require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST, 
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT
});

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
            } else {
                res.send(results.rows);
            };
    });
};

const updateProductById = (req, res, next) => {
    if (req.body.product_name) {
        pool.query(
            'UPDATE products SET product_name = $1 WHERE product_id = $2;', 
            [req.body.product_name, req.params.product_id], 
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        );
    };
    if (req.body.description) {
        pool.query(
            'UPDATE products SET description = $1 WHERE produc_id = $2;',
            [req.body.description, req.params.product_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        )
    }
    if (req.body.price) {
        pool.query(
            'UPDATE products SET price = $1 WHERE product_id = $2;',
            [req.body.price, req.params.product_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        );
    };
    res.send('Updated');
};

const deleteProductById = (req, res, next) => {
    pool.query(
        'DELETE FROM products WHERE product_id = $1;',
        [req.params.product_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(204).send('deleted');
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
        'INSERT INTO orders (user_id, still_in_cart) VALUES ($1, $2);',
        [req.body.user_id, req.body.still_in_cart],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(201).send('order added!')
        }
    );
};

const getOrderById = (req, res, next) => {
    pool.query(
        'SELECT * FROM orders WHERE order_id = $1',
        [req.params.order_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.json(results.rows);
        }
    );
};

const updateOrderById = (req, res, next) => {
    if (req.body.user_id) {
        pool.query(
            'UPDATE orders SET user_id = $1 WHERE order_id = $2',
            [req.body.user_id, req.params.order_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        );
    };
    if (req.body.still_in_cart) {
        pool.query(
            'UPDATE orders SET still_in_cart = $1 WHERE order_id = $2',
            [req.body.still_in_cart, req.params.order_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        );
    };
    res.send('order updated!');
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

const addUser = (req, res, next) => {
    pool.query(
        'INSERT INTO users (username, is_logged_in, hashed_pw) VALUES ($1, true, $2);',
        [req.body.username, req.body.hashed_pw], // password needs to be hashed!
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(201).send('user added!');
        }
    );
};

const getUserById = (req, res, next) => {
    pool.query(
        'SELECT * FROM users WHERE user_id = $1;',
        [req.params.user_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.json(results.rows);
        }
    );
};

const updateUserById = (req, res, next) => {
    if (req.body.username) {
        pool.query(
            'UPDATE users SET username = $1 WHERE user_id = $2',
            [req.body.username, req.params.user_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        )
    }
    if (req.body.is_logged_in) {
        pool.query(
            'UPDATE users SET is_logged_in = $1 WHERE user_id = $2',
            [req.body.is_logged_in, req.params.user_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        );
    };
    if (req.body.hashed_pw) {
        pool.query(
            'UPDATE users SET hashed_pw = $1 WHERE user_id = $2',
            [req.body.hashed_pw, req.params.user_id],
            (err, results) => {
                if (err) {
                    throw err;
                };
            }
        )
    }
    res.send('user updated!');
};

const deleteUserById = (req, res, next) => {
    pool.query(
        'DELETE FROM users WHERE user_id = $1',
        [req.params.user_id],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(204).send('user deleted!');
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

const addOrderedProduct = (req, res, next) => {
    pool.query(
        'INSERT INTO ordered_products VALUES ($1, $2, $3);',
        [req.body.order_id, req.body.product_id, req.body.quantity],
        (err, results) => {
            if (err) {
                throw err;
            };
            res.status(201).send('ordered_product added!');
        }
    );
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