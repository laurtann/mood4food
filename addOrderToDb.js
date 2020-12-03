const { Pool } = require("pg");

// PG database client/connection setup

const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

let foodNames = document.getElementsByClassName("food-name");
let qty = document.getElementsByClassName("qty");
let grandTotal = document.getElementById("order-grand-total").innerText;
let orderNotes = document.getElementById("text-notes").textContent;

const generateRandomNumber = () => {
  const random = Math.floor(Math.random() * 1000) + 61;
  return random;
};

const nameAndQuantity = () => {
  let orderArray = [];
  for (let i = 0; i < foodqty.length; i++) {
    if (Number(qty[i].innerText) !== 0) {
      orderArray.push([foodNames[i].innerText, qty[i].innerText]);
    }
  }
  return orderArray.join("");
};

let queryString = [generateRandomNumber(), nameAndQuantity(), grandTotal];

module.exports.addToOrderDb = (orderNotes, id) => {
  return db
    .query(
    `
    INSERT INTO orders
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `, [queryString[0], queryString[1], queryString[2], queryString[3], orderNotes, id, null]
    )
    .then(res => res.rows[0])
    .catch(err => null);
  };
