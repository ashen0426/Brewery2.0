const axios = require('axios');
const db = require('../db.js');

const brewController = {};

brewController.getBreweries = async (req, res, next) => {
  console.log('made it to the brewController.getBreweries');
  // console.log(req.query.state);
  const userState = req.query.state;
  // const userState = req.params.state;
  console.log(userState);

  // if (userState.includes(' ')) {
  //   userState = userState.replace(' ', '_');
  // }
  // res.locals.breweries = 'ricky';
  // return next();

  try {
    const options = {
      method: 'GET',
      url: `https://api.openbrewerydb.org/breweries?by_state=${userState}`,
      headers: {
        Accept: 'application/json',
      },
    };
    await axios(options).then((response) => {
      const breweries = response.data;
      res.locals.getBreweries = breweries;
    });
    return next();
  } catch (err) {
    throw new Error({
      log: 'error in the brewController getBrews method',
      message: { err: 'error in the brewController getBrews method' },
    });
  }
};

brewController.getVisited = async (req, res, next) => {
  ////// getFaves to Do ////////
  // console.log(`MADE IT TO getVISITED`);
  let usersID;

  if (req.query.id) {
    usersID = req.query.id;
  } else if (req.params.id) {
    req.params.id;
  } else {
    usersID = res.locals.userid; //coming from addVisited controller
  }
  // console.log(`USERSID ${usersID}`);

  //       /:id for getting req.params.id
  const queryString = `SELECT * FROM visited WHERE usersid = ${usersID}`;
  try {
    const visits = await db.query(queryString);
    res.locals.visited = visits.rows;
    console.log(`IN getVISITED res.locals.visited: ${res.locals.visited}`);
    console.log(res.locals.visited);
    return next();
  } catch (err) {
    throw new Error({
      log: 'error in the brewController getVisited method',
      message: { err: 'error in the brewController getVisited method' },
    });
  }
};

brewController.deleteVisitedBrew = async (req, res, next) => {
  // const entryId = req.params.entryId;
  // const queryString = `DELETE FROM visited WHERE id=${entryId}`;
  // const queryString = `DELETE FROM visited WHERE id=${entryId}`;

  try {
    console.log('IN deleteVisitedBrew MiddleWare');
    // console.log(req);
    console.log(`REQUEST BODY: ${req.body}`); //Axios delete request data comes in body
    // console.log(`REQUEST HEADERS: ${req.headers}`);
    // console.log(req.params.breweryid);
    // console.log(req.body.removeVisited);
    const {
      breweryid,
      breweryname,
      brewerytype,
      brewerystate,
      brewerycity,
      breweryphone,
      userId,
    } = req.body;

    res.locals.userid = userId;

    console.log('AFTER DESTRUCTURING');
    // const text = `DELETE FROM visited WHERE usersid = $1 RETURNING *`;
    // const values = [userId];
    const text = `DELETE FROM visited WHERE usersid = $1 AND breweryname = $2 RETURNING *`;
    const values = [userId, breweryname];
    // console.log(`userId: ${userId}`);

    // const queryString = `DELETE FROM visited WHERE usersid=${userId} AND breweryid =${breweryid}`;
    // const queryString = `DELETE FROM visited WHERE usersid=2`;
    // const queryString = `DELETE FROM visited WHERE usersid=2`;

    // await db.query(queryString);
    await db.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    });

    return next();
  } catch (err) {
    throw new Error({
      log: 'error in the brewController deleteVisitedBrews method',
      message: { err: 'error in the brewController deleteVisitedBrews method' },
    });
  }
};

brewController.addVisited = async (req, res, next) => {
  //// I AM NOT sure if this is how I would add new IDs to the res.locals object. I know that it would need to be an array
  /// WHEN IT COMES BACK FROM THE DB ///
  try {
    const {
      breweryid,
      breweryname,
      brewerytype,
      brewerystate,
      brewerycity,
      breweryphone,
      userId,
    } = req.body.addVisited;
    console.log(`Destructured from Post Request`);
    // console.log(req.query.userId);
    // let userId = req.params.userId;
    console.log(`UserID ${userId}`);
    res.locals.userid = userId;
    // const queryString = `INSERT INTO visited (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${userId}, ${breweryid}, ${breweryname}, ${brewerytype}, ${brewerystate}, ${brewerycity}, ${breweryphone})`;
    const text = `INSERT INTO visited (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const values = [
      userId,
      breweryid,
      breweryname,
      brewerytype,
      brewerystate,
      brewerycity,
      breweryphone,
    ];
    // const queryString = `INSERT INTO visited (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${userId}, ${breweryid}, ${breweryname}, ${brewerytype}, ${brewerystate}, ${brewerycity}, ${breweryphone})`;
    // const queryString = `INSERT INTO visited (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${userId}, ${breweryid}, ${breweryname}, ${brewerytype}, ${brewerystate}, ${brewerycity}, ${breweryphone})`;
    // const queryString = `INSERT INTO visited (id, usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${11}, ${1}, ${17}, ${'Amber'}, ${brewerytype}, ${'York'}, ${'LIC'}, ${breweryphone})`;
    // const queryString = `INSERT INTO visited (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${1}, ${'testbrew'}, ${'testbrew9'}, ${'micro'}, ${'new_york'}, ${'NYC'}, ${'452413421'})`;
    // await db.query(queryString);
    await db.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    });
    return next();
  } catch (err) {
    console.log(err);
    // throw new Error({
    //   log: 'error in the brewController deleteVisitedBrews method',
    //   message: { err: 'error in the brewController deleteVisitedBrews method' },
    // });
  }
};

module.exports = brewController;

// const { breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone } = req.body.addToVisitedList
// const usersid = req.params.id
// INSERT INTO visited (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (usersid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone)
