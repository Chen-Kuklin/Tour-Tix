const express = require('express'),
    userRoutes = require('./site');

var router = express.Router();

router.get('/', (req, res) => {
    res.send('welcome to the development api-server');
});


router.get('/site', userRoutes.getSites);
router.post('/site', userRoutes.createSite);
module.exports = router;