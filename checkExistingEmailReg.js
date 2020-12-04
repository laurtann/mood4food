const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
module.exports.fetchEmailId = (email) => {
  const sql =
  `
  SELECT *
  FROM users where email = $1;
  `;
  const params = [email];
  return db.query(sql,params)
      .then((response) => {
        return response.rows[0].email;
      })
      .catch((err)=>{console.log('query error', err);});
  };
