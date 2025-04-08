var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database")
// var resID = 0;

function getReservationID(site, user){
    return new Promise((resolve, reject) => {
        let sql="CALL get_reservation_id(?, ?, @result); SELECT @result AS reservationID;";
        con.query(sql, [site, user],function (err, results) {
        if (err) {
          console.log(err.message)
          return reject(err);
        } else {
          console.log("reservation.js: Call get_reservation_id")
          //const resID = results[1][0]['reservationID'];
          console.log('Reservation ID: ', resID);
          resolve(resID);

        }
      });
    })
    
}

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("payment.js: GET");
    const reservationId = req.session.resID;
    // resID = reservationId;
    console.log("Reservation ID: " + reservationId);
    if (!reservationId) {
        return res.status(400).send("Reservation ID is required");
    }
    res.render('payment', { message: "" , reservationId: reservationId, loggedIn: req.session.loggedIn || false });
});

router.post('/', function(req, res, next) {
    console.log("payment.js: POST");
    const reservationId = req.session.resID; //To be checked once insert_reservation is updated to return reservation ID through resID
    const cardNumber = req.body.cardNum;
    const expirationDate = req.body.expiration_date;
    const billingInfo = req.body.billing_info;
   
    console.log("Card Number is: " + cardNumber);
    if (String(cardNumber).length !== 16 || !/^\d{16}$/.test(cardNumber)) {
        return res.render('payment', { message: "Invalid card number", reservationId: reservationId });
    }

    const expDateParts = expirationDate.split('/');
    if (expDateParts.length !== 2 || !/^\d{2}$/.test(expDateParts[0]) || !/^\d{2}$/.test(expDateParts[1])) {
        return res.render('payment', { message: "Invalid expiration date format", reservationId: reservationId, loggedIn:req.session.loggedIn || false});
    }

    const expMonth = parseInt(expDateParts[0], 10);
    const expYear = parseInt('20' + expDateParts[1], 10);

    const now = new Date();
    const expDate = new Date(expYear, expMonth);

    if (expDate <= now || expMonth < 1 || expMonth > 12) {
        return res.render('payment', { message: "Expired card or invalid month", reservationId: reservationId });
    }
    console.log("Reservation ID in payments.js: " + reservationId);
    req.session.resID = reservationId;
    res.redirect('/confirmation?reservation_id=${reservationId}');
    //res.redirect('/confirmation?reservation_id=${reservationId}', {loggedIn:req.session.loggedIn || false});
});

module.exports = router;
