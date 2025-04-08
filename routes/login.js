var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("login.js: GET");
    res.render('login', { message: '' });
});

/* POST page. */
router.post('/', function(req, res, next) {
    console.log("login.js: POST");
    console.log("The logged in variable is'" + req.session.loggedIn + "'");
    console.log("The username variable is'" + req.body.username + "'");
    console.log("The hashedPassword variable is'" + req.body.hashedPassword + "'");
    
    if (req.body.hashedPassword) {
        const username = req.session.username;
        const hashedPassword = req.body.hashedPassword;
        const sql = "CALL check_credentials(?, ?)";
        
        dbCon.query(sql, [username, hashedPassword], function(err, results) {
            if (err) throw err;
            
            console.log("login.js: Obtained result from accounts table below");
            console.log(results);
            console.log(results[0]);
            console.log(results[0][0]);
            
            if (results[0][0] === undefined || results[0][0].result == 0) {
                console.log("login.js: No login credentials found");
                res.render('login', { message: `Password not valid for user '${username}'. Please log in again.` });
            } else {
                console.log("loginuser.js: Credentials matched");
                req.session.loggedIn = true;
                res.redirect("/");  // Redirect to the home page
            }
        });
    } else if (req.body.username != "") {
        const username = req.body.username;
        console.log("login.js: username is: " + username);
        
        const sql = "CALL get_salt(?)";
        
        dbCon.query(sql, [username], function(err, results) {
            if (err) throw err;
            
            if (results[0][0] === undefined) {
                console.log("login: No results found");
                res.render('login', { message: `User '${username}' not found` });
            } else {
                const salt = results[0][0].salt;
                req.session.username = username;
                req.session.salt = salt;
                res.render('loginPassword', {
                    username: username,
                    salt: salt,
                    message: ''  // Ensure message is defined
                });
            }
        });
    }
});

module.exports = router;
