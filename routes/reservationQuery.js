var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database")

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("reservationQuery.js: GET");
    res.render('reservationQuery', { loggedIn: req.session.loggedIn || false });
});

module.exports = router;