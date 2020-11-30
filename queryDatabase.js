const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = (db) => {
  const getAllMenuItems = () => {
    return db
      .query(
        `
      SELECT * from food_items;`
      )
      .then((response) => {
        console.log(response);
        return response.rows;
      });
  };

  return { getAllMenuItems };
};

// NOT TESTED

// Populate order -> id is order ID from cookie, user_id is user ID from cookie
module.exports = (db) => {
  const getCartItems = (id, user_id, food_id, food_qty) => {
    return db
      .query(
        `
      INSERT INTO orders
      VALUES (${id}, ${user_id}, ${food_id}, ${food_qty}, "ip");`
      )
      .then((response) => {
        console.log("success");
      }).catch(err => null);
  };

  return { getCartItems };
};

// change quantity => order ID from cookie, foodID from table, qty from table
module.exports = (db) => {
  const getCartItems = (orderID, foodID, qty) => {
    return db
      .query(
        `
      UPDATE orders SET food.qty = ${qty}
      WHERE orders.id = ${orderID}
      AND orders.food_id = ${foodID};`
      )
      .then((response) => {
        return response.rows;
      }).catch(err => null);
  };

  return { getCartItems };
};

// query for checkout page
module.exports = (db) => {
  const getCartItems = (orderID) => {
    return db
      .query(
        `
      SELECT name, cost, orders.food_qty as Qty
      FROM food_items
      JOIN orders ON food_items.id = orders.food_id
      WHERE orders_id = ${orderID};`
      )
      .then((response) => {
        return response.rows;
      }).catch(err => null);
  };

  return { getCartItems };
};

// Remove item from cart => this will prob have to be changed once we know the structure of the tbl
module.exports = (db) => {
  const removeItem = (orderID, foodID) => {
    return db
      .query(
        `
      DELETE FROM orders
      WHERE orders.id = ${orderID}
      AND orders.food_id = ${foodID}`
      )
      .then((response) => {
        return response.rows;
      }).catch(err => null);
  };

  return { removeItem };
};



/**
 * Get all food items from a menu.
 * @return {Promise<[{}]>} A promise to the entire menu.
 */
// const getAllMenuItems = function () {
//   const queryString = `
//   SELECT * from food_items`;
//   return pool
//     .query(queryString)
//     .then((res) => res.rows)
//     .catch((err) => {
//       console.log("query error:", err);
//     });
// };

// exports.getAllMenuItems = getAllMenuItems;

// /**
//  * Get a single user from the database given their email.
//  * @param {String} email The email of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
// const getUserWithEmail = function (email) {
//   const queryString = `
//   SELECT * FROM users
//   WHERE email = $1;
//   `;
//   const inputValues = [email.toLowerCase()];
//   return pool
//     .query(queryString, inputValues)
//     .then((res) => {
//       if (res.rows) return res.rows[0];
//       else return null;
//     })
//     .catch((err) => {
//       console.log("query error:", err);
//     });
// };
// exports.getUserWithEmail = getUserWithEmail;

// /**
//  * Get a single user from the database given their id.
//  * @param {string} id The id of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */
// const getUserWithId = function (id) {
//   const queryString = `
//   SELECT * FROM users
//   WHERE users.id = $1;
//   `;
//   const inputValues = [id];
//   return pool
//     .query(queryString, inputValues)
//     .then((res) => {
//       if (res.rows) return res.rows[0];
//       else return null;
//     })
//     .catch((err) => {
//       console.log("query error:", err);
//     });
// };
// exports.getUserWithId = getUserWithId;

// /**
//  * Add a new user to the database.
//  * @param {{name: string, password: string, email: string}} user
//  * @return {Promise<{}>} A promise to the user.
//  */
// const addUser = function (user) {
//   const queryString = `
//   INSERT INTO users(first_name, last_name, phone_num, email, password)
//   VALUES ($1, $2, $3, $4, $5)
//   RETURNING * ;
//   `;
//   const inputValues = [
//     user.first_name,
//     user.last_name,
//     user.phone_num,
//     user.email,
//     user.password,
//   ];
//   return pool
//     .query(queryString, inputValues)
//     .then((res) => {
//       if (res.rows) return res.rows[0];
//       else return null;
//     })
//     .catch((err) => {
//       console.log("query error:", err);
//     });
// };
// exports.addUser = addUser;
