-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);
