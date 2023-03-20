const express = require('express'),

    userRoutes = require('./tour');

var router = express.Router();
router.get('/', (req, res) => {
    res.send('welcome to the development api-server');
});
router.get('/tour', userRoutes.getTours);
router.get('/tour/:id', userRoutes.getTour);

router.post('/tour', userRoutes.createTour);
router.post('/tour/:id/:index', userRoutes.AddSiteToTourpath);
router.post('/tour/:id', userRoutes.AddCuponToTour);
router.put('/tour/:id', userRoutes.update_Trip);
router.delete('/tour/:id', userRoutes.deleteTour);
router.delete('/tour/:id/:code', userRoutes.deleteCopunFromTour);
module.exports = router;