var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");

// GET route to render the customer page
router.get('/', function(req, res, next) {
    var user_id = req.session.user_id;
    var username;
    console.error("user_id at customer get; ", user_id);

    //req.session.username = username;
    dbCon.query('SELECT username FROM users WHERE user_id = ?', [user_id], function(error, account) {
        if (error) {
            console.error("Error fetching account information:", error);
            return next(error);
        }
    username = account[0].username;
    dbCon.query('SELECT * FROM personal_data WHERE user_id = ?', [user_id], function(error, users) {
        if (error) {
            console.error("Error fetching account information:", error);
            return next(error);
        }

        var userDetails = (users && users.length > 0) ? users[0] : null;
        res.render('customer', { users: userDetails, username: username });
    });
    });
});

// POST route to update the username
router.post('/', function(req, res, next) {
    console.error("updateUser.post");
    var user_id = req.session.user_id;

    var username = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var addressLine1 = req.body.address_line_1;
    var addressLine2 = req.body.address_line_2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var email = req.body.email;
    var rank = req.body._rank;
    var branch = req.body.branch;
    var duty_status = req.body.duty_status;
    var phone_number = req.body.phone_number;

    dbCon.query('UPDATE users SET username = ? WHERE user_id = ?', [username, user_id], function(error, result) {
        if (error) {
            console.error("Error updating username:", error);
            return next(error);
        }
        dbCon.query(
            'UPDATE personal_data SET first_name = ?, last_name = ?, address_line_1 = ?, address_line_2 = ?, city = ?, state = ?, zip = ?, email_address = ?, _rank = ?, branch_of_service = ?, duty_status = ?, phone_number = ? WHERE user_id = ?',
            [firstName, lastName, addressLine1, addressLine2, city, state, zip, email, rank, branch, duty_status, phone_number, user_id],
            function(error, result) {
                if (error) {
                    console.error("Error updating personal data:", error);
                    return next(error);
                }
            console.log("Updated successfully.");
            // Redirect to the customer page after updating
            res.redirect('/index');
        });
    });
});

module.exports = router;
