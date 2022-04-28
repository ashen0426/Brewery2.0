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

router.get('/:id', brewController.getVisited, (req, res) => {
  return res.status(200).json(res.locals.visited);
})

router.delete('/delete', brewController.deleteVisitedBrew, brewController.getVisited, (req, res) => {
  return res.status(200).json(res.locals);
});

router.post('/add', brewController.addVisited, brewController.getVisited, (req, res) => {
  return res.status(200).json(res.locals);
});

module.exports = router;
