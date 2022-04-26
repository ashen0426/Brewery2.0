const { Pool } = require("pg");
// const userQueries = require("./userQueries");

const PG_URI =
  "postgres://vjmkyjoo:9Gc-BYRAMhyq8cK67YG-8W-rQqHLp_Xs@isilo.db.elephantsql.com/vjmkyjoo";

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
