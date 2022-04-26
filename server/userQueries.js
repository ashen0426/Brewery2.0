const db = require("./db");

//return all users1
const returnAllUsers = "SELECT * FROM users";
db.query(returnAllUsers)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => console.log("error: ", error));

//return user by ID
const id = req.query.id;
const returnOneUser = `SELECT * FROM users WHERE id = ${id}`;
db.query(returnOneUser)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => console.log("error: ", error));

//insert new user into users table
const addUser =
  "INSERT INTO users (id, firstName, lastName, homeState, userName, pass, hasFavorites) VALUES (default, 'Paul', 'Smith', 'homeState', 'userName', '45qw5', default)";
db.query(addUser)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => console.log("error: ", error));

module.exports = userQueries;
