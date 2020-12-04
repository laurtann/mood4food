const { Pool } = require("pg");

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

const generateRandomNumber = () => {
  const random = Math.floor(Math.random() * 1000) + 61;
  return random;
}

module.exports.addUserDetails = (user) => {

  const sql =
  `
  INSERT INTO users (id, first_name, last_name, phone_num, email, password)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `;

  const params = [generateRandomNumber(), user.first_name, user.last_name, user.phone, user.email, user.password];

  return db.query(sql,params)
      .then((response) => {
         user['id'] = response.rows[0].id;
         return user;
      })
      .catch((err)=>{console.log('query error', err);});
  };



