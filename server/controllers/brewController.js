const axios = require('axios');
const db = require('../db.js');

const brewController = {};

brewController.getBreweries = async (req, res, next) => {
  const username = res.locals.username;
  const queryString = `SELECT homestate FROM users WHERE username = '${username}'`
  const response = await db.query(queryString);
  console.log(response.rows);
  // state = response.rows[0].homestate;
  // console.log(state);
  //const state = response[0];

  const queryString2 = `SELECT * FROM breweries WHERE brewerystate = '${state}'`
  const breweries = await db.query(queryString2);
  // console.log(breweries.fields);
  res.locals.getBreweries = breweries;
  return next();
};

brewController.addBreweriesToDatabase = async (req, res, next) => {
  const userState = res.locals.homestate;
  console.log('in addBreweryToDatabase middleware and the userstate is ', userState);
  const queryString = `SELECT EXISTS (SELECT FROM breweries WHERE brewerystate = '${userState}')`;
  //return next();

  const exist = await db.query(queryString);
  //variable.rows[0].exists
  
  console.log('logging true or false:', exist.rows[0].exists);

  if(exist === 'true'){
    console.log('the state exists');
    queryString = `SELECT * FROM breweries WHERE breweryState = '${userState}'`;
    const breweries = await db.query(queryString);
    res.locals.getBreweries = breweries;
  }
  else{
    console.log('the state does not exist, need fetch from api');

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
        console.log('api fetch success');
      });
    } catch (err) {
      next({
        log: `brewController.getBreweries: ERROR: Error query breweries API by state: ${userState}.`,
        message: { err: 'Error occurred in brewController.getBreweries.'}
      });
    }

    //console.log(res.locals.getBreweries);

    for(let i = 0; i < res.locals.getBreweries.length; i++){
      const { id, name, brewery_type, state, city, phone } = res.locals.getBreweries[i];
      // console.log(id, name, brewery_type, state, city, phone);
      const text =  `INSERT INTO breweries (breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES($1, $2, $3, $4, $5, $6)`;
      const values = [id, name, brewery_type, state, city, phone];
      await db.query(text, values);
    }
  }
  return next();
};

brewController.getVisited = async (req, res, next) => {
  let username = req.query.username;
  let userId = req.query.userId;
  console.log('req.query in getvisted middleware', req.query);
  // let username;
  // if (req.query.username) {
  //   username = req.query.username;
  // } else {
  //   username = res.locals.username; //coming from addVisited controller
  // }
  // gets userId from a supplied username
  // const userIdSelector = `SELECT id FROM users WHERE username = '${username}'`;
  // const getUserId = await db.query(userIdSelector);

  // queries for the list of breweries based on userId
  const queryString = `SELECT * FROM breweries b 
                      INNER JOIN uservisited uv ON b.breweryid = uv.breweryid
                      INNER JOIN users u ON uv.userid = u.id WHERE u.id = $1 AND uv.visited = 'true'`;
  try {
    const visits = db.query(queryString, [userId]);
    res.locals.visited = visits.rows;
    return next();
  } catch (err) {
    next({
      log: `brewController.geVisited: ERROR: ${err.message}, error querying for the list of visited breweries by id: ${userId}.`,
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
    const text = `DELETE FROM uservisited WHERE userid = $1 AND breweryname = $2 RETURNING *`;
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
      log: `brewController.deleteVisitedBrew: ERROR: ${err.message}, error deleting from visited table by userId: ${userId} and breweryname: ${breweryname}.`,
      message: { err: 'Error occurred in brewController.deleteVisitedBrew.'}
    });
  }
};

brewController.addVisited = async (req, res, next) => {
  try {
    const { userId, breweryname } = req.body;
    res.locals.userid = userId;

    // checks for brewery in database
    const checkForBrewery = `SELECT * FROM breweries WHERE breweryid = ${breweryid}`;
    const breweryPresentAlready = db.query(checkForBrewery);

    // if not found, adds it into the breweries table
    if (!breweryPresentAlready) {
      const text = `INSERT INTO breweries (breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
      const values = [userId, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone];
      await db.query(text, values);
    }

    // checks for userId and breweryname in join table
    const checkJoinTable = `SELECT * FROM uservisited WHERE uservisited.userid = $1 and uservisited.breweryname = $2 RETURNING *`;
    const joinValues = [userId, breweryname];
    const alreadyOnVisitedTable = await db.query(checkJoinTable, joinValues);

    // if it's not found in the join table, adds a row for them
    if (!alreadyOnVisitedTable) {
      const text = `INSERT INTO userVisited (userid, breweryid, liked, visited) VALUES ($1,$2,$3,$4) RETURNING *`; 
      const values = [userId, breweryid, false, true];
      await db.query(text, values);
      return next();
    }
  } catch (err) {
    next({
      log: `brewController.addVisited: ERROR: ${err.message}, error inserting into visited table.`,
      message: { err: 'Error occurred in brewController.addVisited.'}
    });
  }
};

module.exports = brewController;

// const { breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone } = req.body.addToVisitedList
// const userid = req.params.id
// INSERT INTO visited (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone) VALUES (userid, breweryid, breweryname, brewerytype, brewerystate, brewerycity, breweryphone)
