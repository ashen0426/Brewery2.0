const bcrypt = require('bcrypt');
/// Added the db requirement - will need to be updated when we put in correct folder
const db = require('./db.js');

const userController = {};

userController.createUser = async (req, res, next) => {
  console.log(req.body.userInfo);
  const {username, password, homestate, firstname, lastname } = req.body.userInfo;
  // const firstname = req.body.newUser.firstname;
  // res.locals.firstname = req.body.newUser.firstname;
  // const lastname = req.body.newUser.lastname;
  // res.locals.lastname = req.body.newUser.lastname;
  // const homestate = req.body.newUser.homestate;
  // res.locals.homestate = req.body.newUser.homestate;
  // const username = req.body.newUser.username;
  // res.locals.username = req.body.newUser.username;
  // const password = req.body.newUser.password;
  if (!username || !password) {
    return next('Missing username or password in createUser');
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryString = `INSERT INTO users (firstname, lastname, homestate, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const value = [firstname, lastname, homestate, username, hashedPassword];
    try {
      const newUser = await db.query(queryString, value);
      res.locals.userInfo = newUser;
      console.log('in create user middleware', newUser);
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
  console.log('in verify login middleware');
  // const username = res.locals.username;
  // const password = res.locals.password;
  const username = req.body.userInfo.username;
  const password = req.body.userInfo.password;
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
  let username;
  if(req.params.username) username = req.params.username;
  else username = req.body.userInfo.username;
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
