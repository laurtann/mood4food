const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = (db) => {
  const fetchUserFromEmail = (email) => {
    return db
      .query(
        `
      SELECT id, password from users
      WHERE users.email = $1;
      ;`, [email]
      )
      .then((response) => {
        return response.rows[0];
      }).catch(err => null);
  };

  return { fetchUserFromEmail };
};
