// const { Pool } = require('pg');
// const pool = new Pool({
//   user: 'labber',
//   password: 'labber',
//   host: 'localhost',
//   database: 'midterm'
// });

const { Pool } = require("pg");

// PG database client/connection setup

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

  console.log('****** Inside of addUserDetails ***');
  console.log('user -----> : ',user);
  return db.query(sql,params)
      .then((response) => {
        console.log(' response.rows --->',response.rows);
         user['id'] = response.rows[0].id;
         console.log(' +++++ user details left side ++++ : ', user.id);
         return user;
      })
      .catch((err)=>{console.log('query error', err);});
  };

  // exports.addUserDetails = addUserDetails;
  // return { addUserDetails };


