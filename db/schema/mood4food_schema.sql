DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_num VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password varchar(255) NOT NULL
)

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  cost integer NOT NULL,
  description text NOT NULL,
  in_stock bolean NOT NULL,
  food_photo_url varchar(255) NOT NULL
)

CREATE TABLE orders(
	id SERIAL PRIMARY KEY NOT NULL,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	food_id integer NOT NULL REFERENCES food_items(id) ON DELETE CASCADE
)
