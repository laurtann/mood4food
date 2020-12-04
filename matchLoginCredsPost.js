const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();
const bcrypt = require('bcrypt');

module.exports.fetchUserDetails = (user) => {

  const sql =
  `
  SELECT *
  FROM users where email = $1;
  `;

  const params = [user.email];

  return db.query(sql,params)
      .then((response) => {
        if(bcrypt.compareSync(user.password, response.rows[0].password)){
          user['id'] = response.rows[0].id;
          return response.rows[0].id;
        }else{
          user['id'] = null;
          return user.id;
        }


      })
      .catch((err)=>{console.log('query error', err);});
  };


