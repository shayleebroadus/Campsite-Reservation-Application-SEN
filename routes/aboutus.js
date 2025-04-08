var express = require('express');
var router = express.Router();

/* GET about us page. */
router.get('/', function(req, res, next) {
    res.render('aboutus', { loggedIn: req.session.loggedIn || false, userID: req.session.userID || null });
});

module.exports = router;
