const { Pool } = require("pg");
// const userQueries = require("./userQueries");

const PG_URI =
  "postgres://wbarptmk:bdbDaZLOe-1MSrjDHG_hR9qb6g17d-sD@isilo.db.elephantsql.com/wbarptmk";

const pool = new Pool({
  connectionString: PG_URI,
});

// pool.on("connect", (client) => {
//   console.log("Connected to Pool", client);
// });

pool.connect(function (err) {
  if (err) throw err;
  console.log("Connected to PostgresDB");
});

module.exports = {
  query: (text, params, callback) => {
    console.log("executed query", text);
    return pool.query(text, params, callback);
  },
};
