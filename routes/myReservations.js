var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");

/* GET myReservations page. */
router.get('/', function(req, res, next) {
    
    username = req.session.username;
    let getUserSql = "SELECT user_id, role FROM users WHERE username = ?";
    dbCon.query(getUserSql, [username], function(err, userResult) {
        if (err) {
            throw err;
        } else {
            user_id = userResult[0].user_id;
            userRole = userResult[0].role;
            const getReservationsSQL = "SELECT * FROM reservations WHERE user_id = ?";
            dbCon.query(getReservationsSQL, [user_id], function(err, reservationResults) {
                if (err) {
                    throw err;
                } else {
                    if (reservationResults.length === 0) {
                        res.render('myReservations', {
                            reservationsData: [],
                            siteData: [],
                            loggedIn: req.session.loggedIn
                        });
                    } else {
                        let siteIds = reservationResults.map(reservation => reservation.site_id);
                        const getSiteSQL = "SELECT * FROM sites WHERE site_id IN (?)";
                        dbCon.query(getSiteSQL, [siteIds], function(err, siteResults) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Site Data: ", JSON.stringify(siteResults, null, 2));
                                console.log("Reservations Data: ", JSON.stringify(reservationResults, null, 2));
                                res.render('myReservations', {
                                    reservationsData: reservationResults,
                                    siteData: siteResults,
                                    loggedIn: req.session.loggedIn
                                });
                            }
                        });
                    }
                }
            });
        }
    });
    console.log("myReservations.js: GET");
});

module.exports = router;
