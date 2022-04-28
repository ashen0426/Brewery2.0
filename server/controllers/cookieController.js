const cookieController = {};

SESSION_TIME = 3000;

cookieController.storeUserInfo = (req, res, next) => {
    console.log('logging new user data', req.body.newUser)
    res.cookie('userName', req.body.newUser.username);
    console.log('in storeUserInfo cookie');
    next();
}

cookieController.session = (req, res, next) => {
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
