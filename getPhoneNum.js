const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = (db) => {
  const getPhoneNumFromId = (phoneNumber) => {
    return db
      .query(
        `
      SELECT phone_num from users
      WHERE users.id = $1;
      ;`, [phoneNumber]
      )
      .then((response) => {
        return response.rows[0];
      }).catch(err => null);
  };

  return { getPhoneNumFromId };
};

