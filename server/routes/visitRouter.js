express = require('express');
const brewController = require('../controllers/brewController');

const router = express.Router();

///////////////////////////////////////////////////////////////////////////
// Not sure if this is how to do the second get to ONLY getVisted //
// router.get("/visited/:userId", brewController.getVisited, (req, res) => {
//   console.log("made it back from controller to apiBrewRouter GET middleware");
//   console.log(res.locals.getBreweries);
//   return res.status(200).json(res.locals.visited);
// });

///////////////////////////////////////////////////////////////////////////
// Would this also need to get Updated visited once it's been deleted
router.delete(
  // '/visited/:userId',
  '/delete',
  brewController.deleteVisitedBrew,
  brewController.getVisited,
  (req, res) => {
    console.log(
      'made it back from controller to the apiBrewRouter DELETE middleware'
    );
    return res.status(200).json(res.locals);
  }
);

router.post(
  // '/visited/:userId',
  '/add',
  brewController.addVisited,
  brewController.getVisited,
  (req, res) => {
    // console.log('IN POST REQUEST');
    // console.log(res.locals.visited);
    console.log(
      'made it back from controller to the apiBrewRouter POST middleware'
    );
    // return res.status(200).json(res.locals.visited);
    return res.status(200).json(res.locals);
  }
);

module.exports = router;
