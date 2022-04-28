const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require('cookie-parser');
const apiBrewRouter = require("./routes/apiBrewRouter");
const visitRouter = require("./routes/visitRouter");
const db = require("./db.js");

const userController = require('./userController');
const cookieController = require('./controllers/cookieController')
const brewController = require('./controllers/brewController')
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiBrewRouter);

app.use("/visited", visitRouter);

app.use("/client", express.static(path.resolve(__dirname, "../client")));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/template.html'));
});



app.get('/login', 
  userController.checkUser, 
  (req, res) => {
  res.status(200);
});


app.get('/getUser/:username', userController.getUser, (req, res) => {
  res.status(200).json(res.locals.userInfo);
})


app.post('/createUser', 
  //cookieController.storeUserInfo, //can store anything else that needed in frontend
  userController.createUser, 
  brewController.addBreweriesToDatabase, 
  cookieController.session,
  (req, res) => {
  console.log('create user successful, sending back list of breweries'),
  res.status(200).json(res.locals.getBreweries); // sending back the brewery list 
});



app.delete('/deleteUser', 
userController.deleteUser, 
(req, res) => {
  res.status(200).json('You have succesfully deleted the user.');
})


app.post('/login', 
  userController.verifyLogin,
  brewController.getBreweries,
  cookieController.session, 
  (req, res) => {
  console.log('log in successful, sending back list of breweries'),
  res.status(200).json(res.locals.getBreweries)});


// app.post('/login', cookieController.storeUserInfo, userController.verifyLogin, brewController.getBreweries, (req, res) => {
//   // console.log("finished the login process, back in server.js, res.locals is storing ", res.locals.getBreweries);
//   res.status(200).json(res.locals.getBreweries); // do they need userInfo to be sent back?
// >>>>>>> main
// });


// ERROR HANDLER
//invoked if you pass an argument to next()
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };

  const errorObj = Object.assign(defaultErr, err);

  console.log("ERROR: ", errorObj.log);
  return res.status(errorObj.status).send(errorObj.message);
});

module.exports = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
