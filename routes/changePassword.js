var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database")
let ResultMessage = '';
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("changePassword.js: GET");
    res.render('changePassword', {loggedIn: req.session.loggedIn || false });
    //res.render('changePassword', {message : ResultMessage});
});


/* POST page. */
router.post('/changePassword', function(req, res, next) {
    console.log("changePassword.js: POST change-password");
    const username = req.session.username;
    //const username = 'user1';
    const salt = req.body.salt;
    const hash = req.body.hash;
    //ResultMessage = '';

    console.log("changePassword.js: username: " + username + " salt: " + salt + " hash: " + hash);
    let sql = "CALL user_change_password(?, ?, ?)";
    dbCon.query(sql, [username, hash, salt], function (err, result) {
        if (err) {
            console.log(err.message);
            throw err;
        }
        console.log("Password changed for user:", username);
        res.redirect('/changePassword');
    });
});

module.exports = router;