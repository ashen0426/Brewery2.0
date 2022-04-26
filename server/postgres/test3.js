// CREATE TABLE users (
//   id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//   "firstName" text,
//   "lastName" text,
//   "homeState" text,
//   "userName" text,
//   "passWord" text,
//   "hasFavorites" boolean DEFAULT false
// );

async function registerUser(user) {
  const text = `
    INSERT INTO people (firstName, lastName, homeState, userName, passWord, hasFavorites)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  const values = [
    user.firstName,
    user.lastName,
    user.homeState,
    user.userName,
    user.passWord,
    user.hasFavorites,
  ];
  return pool.query(text, values);
}

async function getUser(userId) {
  const text = `SELECT * FROM users WHERE id = $1`;
  const values = [userId];
  return pool.query(text, values);
}

async function updateUserName(userId, fullname) {
  const text = `UPDATE people SET fullname = $2 WHERE id = $1`;
  const values = [userId, fullname];
  return pool.query(text, values);
}

async function removeUser(userId) {
  const text = `DELETE FROM people WHERE id = $1`;
  const values = [userId];
  return pool.query(text, values);
}
