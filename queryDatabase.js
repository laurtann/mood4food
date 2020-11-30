
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
        return response.rows;
      });
  };

  return { getAllMenuItems };
};
