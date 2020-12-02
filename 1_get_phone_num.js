const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports = (db) => {
  const getPhoneNumFromId = () => {
    return db
      .query(
        `
      SELECT phone_num from users
      WHERE users.id = 1;
      ;`
      )
      .then((response) => {
        return response.rows;
      });
  };

  return { getPhoneNumFromId };
};

