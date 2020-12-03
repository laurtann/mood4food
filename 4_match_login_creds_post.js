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
        console.log('user.password : on right side --> ', user.password);
        console.log('response.rows[0].password : on right side --> ', response.rows[0].password);
        if(bcrypt.compareSync(user.password, response.rows[0].password)){
          console.log('inside if block of right side');
          user['id'] = response.rows[0].id;
          console.log(' user id : ', response.rows[0].id);
          return response.rows[0].id;
        }else{
          console.log('inside else block of right side');
          user['id'] = null;
          return user.id;
        }


      })
      .catch((err)=>{console.log('query error', err);});
  };


