const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

const addToOrderDb = require("./public/scripts/checkout.js")

module.exports = (db) => {
  const addFoodToOrder = () => {
    return db
      .query(
      `
      INSERT INTO orders
      VALUES (${id}, ${user_id}, ${food_id}, ${food_qty}, "ip");`
      )
      .then((response) => {
        return response.rows;
      });
  };

  return { addFoodToOrder };
};
