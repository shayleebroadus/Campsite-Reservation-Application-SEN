var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database")

// /* GET home page. */
// router.get('/', function(req, res, next) {
//     console.log("confirmation.js: GET");
//     res.render('confirmation', { });
// });

/* GET confirmation page */
router.get('/', function(req, res, next){
    console.log("confirmation.js: GET");

    // const reservationId = req.query.reservationId;
    // const siteId = req.query.siteId;

    console.log("Reservation ID result:", req.query);
    
    const reservationId = req.session.resID;
    if (!reservationId) {
        console.error("Reservation ID not provided in the query parameters");
        return res.status(400).send("Reservation ID is required");
    }
    // const siteId = 1;

    //res.render('confirmation', { reservationId: reservationId, siteId: siteId });
    getReservationDetails(reservationId)
        .then(reservationDetails => {
            if (reservationDetails) {
                console.log("Confirmation for Reservation ID:", reservationDetails.reservation_id);
                res.render('confirmation', {
                    siteNumber: reservationDetails.site_id,
                    reservationId: reservationDetails.reservation_id,
                    loggedIn:req.session.loggedIn || false
                });
            } else {
                res.status(404).send('Reservation not found');
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Server error');
        });
});

function getReservationDetails(reservationId) {
    return new Promise((resolve, reject) => {
        const sql =
            "SELECT r.reservation_id, r.site_id\n" +
            "FROM reservations r\n" +
            "WHERE r.reservation_id = ?\n" +
            ";";
        dbCon.query(sql, [reservationId], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]);
        });

    });
}

module.exports = router;