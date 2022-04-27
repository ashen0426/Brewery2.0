const bcrypt = require('bcrypt');
/// Added the db requirement - will need to be updated when we put in correct folder
const db = require('./db.js');

const userController = {};

userController.createUser = async (req, res, next) => {
  const { firstname, lastname, homestate, username, password } = req.body.newUser;
  if (!username || !password) {
    return next('Missing username or password in createUser');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryString = `INSERT INTO users (firstname, lastname, homestate, username, password) VALUES ($1, $2, $3, $4, $5)`;
    const value = [firstname, lastname, homestate, username, hashedPassword];
    try {
      db.query(queryString, value);
      return next();
    } catch (err) {
      next({
        log: `userController.createUser: ERROR: Error during creation of a new user.`,
        message: { err: 'Error occurred in userController.createUser.'}
      });
  }
};

userController.verifyLogin = async (req, res, next) => {
  const { username, password } = req.body.userInfo;
  if (!username || !password) {
    return res.status(400).send('Missing username or password in userController.verifyLogin.');
  } else {
      const queryString = `SELECT password FROM users WHERE username = $1`;
      const value = [username];
      try {
        const dbPassword = db.query(queryString, value);
        if (!dbPassword.rows[0]) {
          return res.send('Username does not exist');
        }
        if (await bcrypt.compare(password, dbPassword.rows[0].password)) {
          console.log('Passwords match!!!');
          return next();
        } else {
          return res.status(401).send('Incorrect password');
        } 
      } catch (err) {
        next({
          log: `userController.verifyLogin: ERROR: Error during username and password verification.`,
          message: { err: 'Error occurred in userController.verifyLogin.'}
        });
      }
  }
};

userController.setCookie = (req, res, next) => {
  // set cookie with a name, value (in this case the username)
  // httpOnly prevents the client from editing cookie in the browser
  try {
    res.cookie('BrewCookie', req.body.userInfo.username, { httpOnly: true });
    return next();
  } catch (err) {
    next({
      log: `userController.setCookie: ERROR: Error adding a cookie to the response object.`,
      message: { err: 'Error occurred in userController.setCookie.'}
    });
  }
};

userController.checkUser = (req, res, next) => {
  try {
    if(!req.cookies) { 
      next() 
    } else { 
      res.sendFile(path.resolve(__dirname, '../client/components/UserLanding.jsx'));
    };
  } catch (err) {
    next({
      log: `userController.checkUser: ERROR: Error checking for a cookie in the request object.`,
      message: { err: 'Error occurred in userController.checkUser.'}
    });
  }
}

userController.getUser = async (req, res, next) => {
  const { username } = req.body;
  const returnOneUser = `SELECT * FROM users WHERE username = ${username}`;
  try {
    const response = db.query(returnOneUser);
    res.locals.userInfo = response.rows[0];
    return next();
  } catch (err) {
    next({
      log: `userController.getUser: ERROR: Error retrieving a row from users table.`,
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