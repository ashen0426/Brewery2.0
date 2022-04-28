const bcrypt = require('bcrypt');
/// Added the db requirement - will need to be updated when we put in correct folder
const db = require('./db.js');

const userController = {};

userController.createUser = async (req, res, next) => {
  const firstname = req.body.userInfo.firstname;
  res.locals.firstname = req.body.userInfo.firstname;
  const lastname = req.body.userInfo.lastname;
  res.locals.lastname = req.body.userInfo.lastname;
  const homestate = req.body.userInfo.homestate;
  res.locals.homestate = req.body.userInfo.homestate;
  const username = req.body.userInfo.username;
  res.locals.username = req.body.userInfo.username;
  const password = req.body.userInfo.password;

  if (!username || !password) {
    return next('Missing username or password in createUser');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryString = `INSERT INTO users (firstname, lastname, homestate, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const value = [firstname, lastname, homestate, username, hashedPassword];
    try {
      const newUser = await db.query(queryString, value);
      res.locals.userInfo = newUser;
      return next();
    } catch (err) {
      next({
        log: `userController.createUser: ERROR: Error during creation of a new user.`,
        message: { err: 'Error occurred in userController.createUser.'}
      });
  }
  }
};

userController.verifyLogin = async (req, res, next) => {
  const username = res.locals.username;
  const password = res.locals.password;
  if (!username || !password) {
    return res.status(400).send('Missing username or password in userController.verifyLogin.');
  } else {
      const queryString = `SELECT password FROM users WHERE username = $1`;
      const value = [username];
      try {
        const dbResults = await db.query(queryString, value);
        const dbPassword = dbResults.rows[0].password;
        if (!dbPassword) {
          return res.send('Username does not exist');
        }
        if (bcrypt.compare(password, dbPassword)) {
          console.log('Passwords match!!!');
          return next();
        } else {
          return res.status(401).send('Incorrect password');
        } 
      } catch (err) {
        next({
          log: `userController.verifyLogin: ERROR: ${err}`,
          message: { err: 'Error occurred in userController.verifyLogin.'}
        });
      }
  }
};

// userController.setCookie = async (req, res, next) => {
//   // set cookie with a name, value (in this case the username)
//   // httpOnly prevents the client from editing cookie in the browser
//   try {
//     await res.cookie('BrewCookie', req.body.userInfo.username, { httpOnly: true });
//     return next();
//   } catch (err) {
//     next({
//       log: `userController.setCookie: ERROR: Error adding a cookie to the response object.`,
//       message: { err: 'Error occurred in userController.setCookie.'}
//     });
//   }
// };

userController.checkUser = (req, res, next) => {
  try {
    if(!req.cookies) { 
      return next();
    } else { 
      res.redirect('/userlanding');
    };
  } catch (err) {
    next({
      log: `userController.checkUser: ERROR: Error checking for a cookie in the request object.`,
      message: { err: 'Error occurred in userController.checkUser.'}
    });
  }
}

userController.getUser = async (req, res, next) => {
  const { username } = req.params;
  const returnOneUser = `SELECT * FROM users WHERE username = $1`;
  const value = [username];
  try {
    const response = await db.query(returnOneUser, value);
    res.locals.userInfo = response.rows[0];
    return next();
  } catch (err) {
    next({
      log: `userController.getUser: ERROR: ${err}`,
      message: { err: 'Error occurred in userController.getUser.'}
    });
  }
}

userController.deleteUser = async (req, res, next) => {
  const { userId } = req.body;
  const text = `DELETE FROM users WHERE userid = $1 RETURNING *`;
  const values = [userId];
  try {
    db.query(text, values);
    return next();
  } catch (err) {
    next({
      log: `userController.deleteUser: ERROR: Error deleting a row from users table.`,
      message: { err: 'Error occurred in userController.deleteUser.'}
    });
  }
}


module.exports = userController;
