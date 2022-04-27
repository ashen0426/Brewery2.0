const db = require("./db");

//return all users1
const returnAllUsers = "SELECT * FROM users";
db.query(returnAllUsers)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    next({
      log: `userQueries.returnAllUsers: ERROR: ${error}`,
      message: { error: 'Error occurred in userQueries.returnAllUsers.'}
    });
  })

//return user by ID
const id = req.query.id;
const returnOneUser = `SELECT * FROM users WHERE id = ${id}`;
db.query(returnOneUser)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    next({
      log: `userQueries.returnOneUser: ERROR: ${error}`,
      message: { error: 'Error occurred in userQueries.returnOneUser.'}
    });
  })

//insert new user into users table
const addUser =
  "INSERT INTO users (id, firstName, lastName, homeState, userName, pass, hasFavorites) VALUES (default, 'Paul', 'Smith', 'homeState', 'userName', '45qw5', default)";
db.query(addUser)
  .then((response) => {
    console.log("response: ", response);
  })
  .catch((error) => {
    next({
      log: `userQueries.addUser: ERROR: ${error}`,
      message: { error: 'Error occurred in userQueries.addUser.'}
    });
  })

module.exports = userQueries;

