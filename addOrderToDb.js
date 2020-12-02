const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

const addFoodToOrder = require("./public/scripts/checkout.js");

module.exports = (db) => {
  const addToOrderDb = (addFoodToOrder) => {
    for (let arr of addFoodToOrder) {
    return db
      .query(
      `
      INSERT INTO orders
      VALUES ($1, $2, $3, $4, $5);
      `, [arr[0], arr[1], arr[2], arr[3], arr[4]]
      )
      .then(res => res.rows[0])
      .catch(err => null);
    }
  };

  return { addToOrderDb };
};
