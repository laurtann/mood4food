const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "labber",
  password: "labber",
  host: "localhost",
  database: "midterm",
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;
  const inputValues = [email.toLowerCase()];
  return pool
    .query(queryString, inputValues)
    .then((res) => {
      if (res.rows) return res.rows[0];
      else return null;
    })
    .catch((err) => {
      console.log("query error:", err);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
  SELECT * FROM users
  WHERE users.id = $1;
  `;
  const inputValues = [id];
  return pool
    .query(queryString, inputValues)
    .then((res) => {
      if (res.rows) return res.rows[0];
      else return null;
    })
    .catch((err) => {
      console.log("query error:", err);
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
  INSERT INTO users(first_name, last_name, phone_num, email, password)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING * ;
  `;
  const inputValues = [
    user.first_name,
    user.last_name,
    user.phone_num,
    user.email,
    user.password,
  ];
  return pool
    .query(queryString, inputValues)
    .then((res) => {
      if (res.rows) return res.rows[0];
      else return null;
    })
    .catch((err) => {
      console.log("query error:", err);
    });
};
exports.addUser = addUser;

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const inputValues = [guest_id, limit];
  return pool
    .query(queryString, inputValues)
    .then((res) => res.rows)
    .catch((err) => {
      console.log("query error:", err);
    });
};
exports.getAllReservations = getAllReservations;

const getAllMenuItems = function () {
  const queryString = `
  SELECT * from food_items`;
  return pool
    .query(queryString)
    .then((res) => res.rows)
    .catch((err) => {
      console.log("query error:", err);
    });
};

exports.getAllMenuItems = getAllMenuItems;
