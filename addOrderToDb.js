const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// const generateRandomNumber = () => {
//   const random = Math.floor(Math.random() * 1000) + 61;
//   return random;
// };

// module.exports.addToOrderDb = (nameAndQty, orderNote, total, userId, orderStatus) => {
//   return db
//     .query(
//     `
//     INSERT INTO orders
//     VALUES ($1, $2, $3, $4, $5, $6)
//     RETURNING *;
//     `, [generateRandomNumber(), nameAndQty, orderNote, total, userId, orderStatus]
//     )
//     .then(res => res.rows[0])
//     .catch(err => null);
//   };

  module.exports.addToOrderDb = (orderNumber, nameAndQty, total, orderNote, orderStatus, userId) => {
    return db
    .query(
    `
    INSERT INTO orders
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `, [orderNumber, nameAndQty, total, orderNote, orderStatus, userId]
    )
    .then(res => console.log("This is fine---", res.rows[0]))
    .catch(err => console.log(err));
  };
