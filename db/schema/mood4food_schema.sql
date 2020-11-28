CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_num VARCHAR(32) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password varchar(255) not null
)

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  cost integer not null,,
  description text not null,
  in_stock bolean not null
  food_photo_url varchar(255) not null
)

CREATE TABLE orders(
	id serial primary key,
	user_id integer not null references users(id) on delete cascade,
	food_id integer not null references food_items(id) on delete cascade
)
