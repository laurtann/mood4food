const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

module.exports.updateOrderStatus = (orderTime, orderId) => {
  return db
  .query(
  `
  UPDATE orders
  SET order_status = $1
  WHERE orders.id = $2;
  `, [orderTime, orderId]
  )
  .then(res => console.log("This is fine---", res.rows[0]))
  .catch(err => console.log(err));
};
