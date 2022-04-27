const axios = require('axios');
const db = require('../db.js');

const brewController = {};

brewController.getBreweries = async (req, res, next) => {
  const userState = req.params.state;
  if (userState.includes(' ')) {
    userState = userState.replace(' ', '_');
  }
  const options = {
    method: 'GET',
    url: `https://api.openbrewerydb.org/breweries?by_state=${userState}`,
    headers: {
      Accept: 'application/json',
    }
  };
  try {
    await axios(options).then((response) => {
      const breweries = response.data;
      res.locals.getBreweries = breweries;
    });
    return next();
  } catch (err) {
    next({
      log: `brewController.getBreweries: ERROR: Error query breweries API by state: ${userState}.`,
      message: { err: 'Error occurred in brewController.getBreweries.'}
    });
  }
};

brewController.getVisited = (req, res, next) => {
  let username;
  if (req.params.username) {
    username = req.params.username;
  } else {
    username = res.locals.username; //coming from addVisited controller
  }
  const queryString = `SELECT * FROM uservisited WHERE userid = $1`;
  try {
    const visits = db.query(queryString, [username]);
    res.locals.visited = visits.rows;
    return next();
  } catch (err) {
    next({
      log: `brewController.geVisited: ERROR: Error query breweries API by id: ${userId}.`,
      message: { err: 'Error occurred in brewController.getVisited.'}
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
    // const text = `DELETE FROM visited WHERE userid = $1 RETURNING *`;
    // const values = [userId];
    const text = `DELETE FROM visited WHERE userid = $1 AND breweryname = $2 RETURNING *`;
    const values = [userId, breweryname];
    // console.log(`userId: ${userId}`);

    // const queryString = `DELETE FROM visited WHERE userid=${userId} AND breweryid =${breweryid}`;
    // const queryString = `DELETE FROM visited WHERE userid=2`;
    // const queryString = `DELETE FROM visited WHERE userid=2`;

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
    next({
      log: `brewController.deleteVisitedBrew: ERROR: Error deleting from visited table by userId: ${userState} and breweryname: ${breweryname}.`,
      message: { err: 'Error occurred in brewController.deleteVisitedBrew.'}
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
    // const queryString = `INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${userId}, ${breweryid}, ${breweryname}, ${brewerytype}, ${brewerystate}, ${brewerycity}, ${breweryphone})`;
    const text = `INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const values = [
      userId,
      breweryid,
      breweryname,
      brewerytype,
      brewerystate,
      brewerycity,
      breweryphone,
    ];
    // const queryString = `INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${userId}, ${breweryid}, ${breweryname}, ${brewerytype}, ${brewerystate}, ${brewerycity}, ${breweryphone})`;
    // const queryString = `INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${userId}, ${breweryid}, ${breweryname}, ${brewerytype}, ${brewerystate}, ${brewerycity}, ${breweryphone})`;
    // const queryString = `INSERT INTO visited (id, userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${11}, ${1}, ${17}, ${'Amber'}, ${brewerytype}, ${'York'}, ${'LIC'}, ${breweryphone})`;
    // const queryString = `INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (${1}, ${'testbrew'}, ${'testbrew9'}, ${'micro'}, ${'new_york'}, ${'NYC'}, ${'452413421'})`;
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
    next({
      log: `brewController.addVisited: ERROR: Error inserting into visited table.`,
      message: { err: 'Error occurred in brewController.addVisited.'}
    });
  }
};

module.exports = brewController;

// const { breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone } = req.body.addToVisitedList
// const userid = req.params.id
// INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone)
