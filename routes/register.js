var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database")

/* GET register page. */
router.get('/', function(req, res, next) {
    console.log("register.js: GET");
    res.render('register', { });
});


//post
router.post('/', function(req, res, next) {
    console.log("register.js: POST");
    
    // Get values from POST request body
    const username = req.body.username;
    const salt = req.body.salt;
    const hash = req.body.hash;
    console.log("Your Hash is: " + hash)
    console.log("Your Salt is: " + salt)
    
    console.log("register.js: username: " + username + ", salt: " + salt + ", hash: " + hash);
    
    // Prepare the SQL query with placeholders for parameters
    let sql = "CALL register_user(?, ?, ?, ?, @result); SELECT @result AS result;";

    // Execute the query with parameters
    dbCon.query(sql, [username, hash, salt, 'cust'], function(err, results, fields) {
        if (err) {
            throw err;
        } else {
            // Check the result returned by the stored procedure
            const result = results[1][0].result;
            if (result === 0) {
                // Successful registration
                // Set session variables
                req.session.username = username;
                req.session.loggedIn = true;
                
                
                // Save session data
                req.session.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    dbCon.query('Select user_id FROM users WHERE username = ?', [username], function(error, account) {
                            if (error) {
                                console.error("Error fetching account information:", error);
                                return next(error);
                            }
                            req.session.user_id = account[0].user_id;

                    console.log("register.js: Successful registration. Session username: " + req.session.username);
                    res.redirect('/'); // Redirect to the home page
                });
            });
            } else {
                // Username already exists
                console.log("register.js: Username already exists. Reloading register page with error message.");
                res.render('register', { message: "The username '" + username + "' already exists" , loggedIn: req.session.loggedIn || false});
            }
        }
    });
});

module.exports = router;