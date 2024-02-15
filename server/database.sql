-- The products table stores products that are for sale.

CREATE TABLE products (
    product_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name text NOT NULL,
    description text NOT NULL,
    price money NOT NULL,
    image_name text
);

INSERT INTO products (product_name, description, price, image_name)
VALUES 
('Simple White', 'Steps in for the classic white sock that somehow always gets lost between the couch cushions. Ideal for everyday use, from sports to casual wear.', 0.89, 'simple_white.jpg'),
('Classic Black', 'The essential replacement for that everyday black sock that mysteriously left its partner behind in the laundry. A staple for any wardrobe, versatile and classic.', 0.89, 'basic_black.jpg'),
('The Strider', 'Ideal for replacing that lone athletic sock lost in the gym locker room. Features moisture-wicking fabric and a sleek design for the active individual.', 1.99, 'strider.jpg'),
('Cozy Cabin', 'A perfect match for the sock left behind at a winter cabin retreat. Thick, woolen, and plaid-patterned for ultimate warmth and comfort.', 1.25, 'cozy_cabin.jpg'),
('Executive Stripes', 'Replaces the sock lost in a busy workday hustle. Offers a professional look with subtle stripes, suitable for all business occasions.', 2.99, 'executive_stripes.jpg'),
('Rainbow Bright', 'The go-to replacement for the vibrant sock that vanished during laundry day. Adds a cheerful splash of color to any outfit.', 0.85, 'rainbow_bright.jpg'),
('Eco-Friendly Footprint', 'Steps in for the eco-sock that got away during a weekend hike. Made from sustainable, organic cotton, balancing comfort with environmental consciousness.', 1.99, 'eco_friendly.jpg'),
('Argyle Adventure', 'Fills in for the lost sock from your last casual outing. Features a classic argyle pattern, blending timeless style with everyday wear.', 1.30, 'argyle_adventure.jpg'),
('Neon Nightlife', 'A flashy substitute for the neon sock that disappeared after a night out. Glows in the dark, perfect for parties and lively events.', 2.50, 'neon_nightlife.jpg'),
('Gentle Yoga', 'Replaces the misplaced yoga sock. Offers grip and stability for yoga and pilates, ensuring comfort and balance in every pose.', 2.88, 'gentle_yoga.jpg');

-- Users are added to the users table when they register.
-- When a user logs in, their login information is compared to the users table.

CREATE TABLE users (
    user_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username text UNIQUE,
    hashed_pw text
);

INSERT INTO users (username, hashed_pw)
VALUES 
('dog_ate_my_socks', 'asdfasdf'),
('FootwearCollector', 'qwerqwer');


-- Orders coordinate users with ordered_products, using an order_id and user_id.

CREATE TABLE orders (
    order_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer REFERENCES users(user_id)
);

INSERT INTO orders (user_id)
VALUES
(1),
(2);

-- Ordered products are products selected by the customer with associated quantity. 
-- They have a many to many relationship with orders.
-- The primary key is a composite of order_id and product_id.

CREATE TABLE ordered_products (
    order_id integer REFERENCES orders(order_id),
    product_id integer REFERENCES products(product_id),
    quantity integer NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

INSERT INTO ordered_products
VALUES 
(1, 4, 3),
(2, 1, 1);

-- Session table is managed by connect-pg-simple.
-- It keeps track of users currently logged in.
-- Expired sessions are automatically deleted from the table.

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
