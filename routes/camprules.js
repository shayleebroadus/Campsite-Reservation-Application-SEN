var express = require('express');
var router = express.Router();

/* GET camp rules page. */
router.get('/', function(req, res, next) {
    res.render('camprules', { loggedIn: req.session.loggedIn || false, userID: req.session.userID || null });
});

module.exports = router;
