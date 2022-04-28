
const db = require('../db.js');

const cookieController = {};

SESSION_TIME = 3000;

cookieController.storeUserInfo = (req, res, next) => {
    // console.log('logging new user data', req.body.userInfo);
    res.locals.username = req.body.userInfo.username;
    // res.locals.password = req.body.userInfo.password;
    // res.locals.username = req.body.userInfo.username;
    // res.locals.password = req.body.userInfo.password;
    // set cookie to expire after 1 week
    res.cookie('userName', req.body.userInfo.username, { expires: new Date(Date.now() + 604800000) });
    // console.log('in storeUserInfo cookie');
    next();
}

cookieController.session = async (req, res, next) => {
    let userName = req.body.userInfo.username;
    let queryString = `UPDATE users SET hasCookie = 'true' WHERE username = '${userName}'`;
    await db.query(queryString);
    res.cookie('session', 'session alive', {expires: new Date(Date.now() + 86400), httpOnly: true});
    console.log('in startSession cookie');
    next();
}

cookieController.verifySession = (req, res, next) => {
    console.log('in verifySession cookie');
    if(!req.cookies.session){
        console.log('no session created');
        res.redirect('/login')
    }
    else {
        return next();
    }
}

module.exports = cookieController;
