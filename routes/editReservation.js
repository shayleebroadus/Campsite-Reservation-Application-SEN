var express = require('express');
var router = express.Router();
var dbCon = require("../lib/database");

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("editReservation.js: GET");
    var username = req.session.username;
    console.log("username passed in = " + username);
    dbCon.query('CALL get_by_username(?)', [username], function(err, results, fields) {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving user ID');
            return;
        }

        var userId = results[0][0].user_id;

        dbCon.query('SELECT * FROM reservations WHERE user_id = ?', [userId], function(err, reservationResults, fields) {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving reservations');
                return;
            }

            if (reservationResults.length > 0) {
                var reservedSite = reservationResults[0].site_id;
                dbCon.query('SELECT * FROM sites WHERE site_id = ?', [reservedSite], function(err, siteResults, fields) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error retrieving sites');
                        return;
                    }
                    res.render('editReservation', { reservations: reservationResults, sites: siteResults });
                });
            } else {
                res.render('editReservation', { reservations: [], sites: [] });
            }
        });
    });
});

// site detail form post or something
router.post('/', function(req, res, next) {
    var username = req.session.username;
    var site_id = req.body.site;

    dbCon.query('CALL get_by_username(?)', [username], function(err, results, fields) {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving user ID');
            return;
        }
      
        var userId = results[0][0].user_id;

        dbCon.query('SELECT * FROM reservations WHERE user_id = ?', [userId], function(err, reservationResults, fields) {
            if (err) {
                console.error(err);
                res.status(500).send('Error retrieving reservations');
                return;
            }

            if (reservationResults.length > 0) {
                dbCon.query('SELECT * FROM sites WHERE site_id = ?', [site_id], function(err, siteResults, fields) {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Error retrieving sites');
                        return;
                    }
                    res.render('editReservation', { reservations: reservationResults, sites: siteResults });
                });
            } else {
                res.render('editReservation', { reservations: [], sites: [] });
            }
        });

    });
});

router.post('/change', function(req, res, next) {
    var username = req.session.username;
    var site_id = req.body.selectsite;
    var from_date = req.body.fromDate;
    var to_date = req.body.toDate;
    var pcs_sub = req.body.pcssub;
    var res_note = req.body.resNote;
    var rule_agree = req.body.ruleagree;
    var reserve_bool = req.body.reservebool;
    console.log(site_id, from_date, to_date, pcs_sub, res_note, rule_agree, reserve_bool);

    const insertProcedure = `
        CALL insert_reservation(?, ?, ?, ?, ?, ?, ?, @result);
        SELECT @result AS result;
    `;

    dbCon.query('CALL get_by_username(?)', [username], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving user ID');
        }

        var userId = results[0][0].user_id;

        dbCon.query('SELECT * FROM reservations WHERE user_id = ?', [userId], function(error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send('Error retrieving reservations');
            }

            var old_reservation = results[0];
            var old_site_id = old_reservation.site_id;
            var old_from_date = old_reservation.from_date;
            var old_to_date = old_reservation.to_date;
            var old_pcs_sub = old_reservation.pcs_sub;
            var old_res_note = old_reservation.res_note;
            var old_rule_agree = old_reservation.rule_agree;
            var old_reserve_bool = old_reservation.reserve_bool;

            console.log(old_site_id, old_from_date, old_to_date, old_pcs_sub, old_res_note, old_rule_agree, old_reserve_bool);

            dbCon.query('DELETE FROM reservation_transactions WHERE reservation_id IN (SELECT reservation_id FROM reservations WHERE user_id = ?)', [userId], function(deleteError, deleteResults) {
                if (deleteError) {
                    console.error(deleteError);
                    return res.status(500).send(deleteError);
                }
            });

                dbCon.query('DELETE FROM reservations WHERE user_id = ?', [userId], function(deleteError, deleteResults) {
                    if (deleteError) {
                        console.error(deleteError);
                        return res.status(500).send(deleteError);
                    }

                dbCon.query(insertProcedure, [site_id, calculateLengthOfStay(from_date, to_date),
                     from_date, to_date, pcs_sub, userId, res_note], function(insertError, insertResults) {
                    if (insertError) {
                        console.error(insertError);
                        return res.status(500).send(insertError);
                    }

                    const result = insertResults[1][0].result;
                    if (result === 1) {
                        console.log('New reservation inserted successfully');
                        res.redirect('/myReservations');
                    } else {
                        console.log('Reservation not available');
                        const revertQuery = `
                            INSERT INTO reservations(site_id, from_date, to_date, pcs_sub, user_id, res_note, rule_agree, reserve_bool)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                             `;
                        
                        const revertValues = [old_site_id, old_from_date, old_to_date, old_pcs_sub, userId, old_res_note, old_rule_agree, old_reserve_bool];
                        dbCon.query(revertQuery, revertValues, function(revertError, revertResults) {
                            if (revertError) {
                                console.error(revertError);
                                return res.status(500).send(revertError);
                            }
                            console.log('Old reservation inserted successfully');
                            res.redirect('/myReservations');
                        });
                    }
                });
            });
        });
    });
});

router.post('/cancel', function(req, res, next) {
    var username = 'user1'; // req.body.username Assuming you will replace with the actual username from the request body

    dbCon.query('CALL get_by_username(?)', [username], function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving user ID');
        }

        var userId = results[0][0].user_id;

        dbCon.query('DELETE FROM reservation_transactions WHERE reservation_id IN (SELECT reservation_id FROM reservations WHERE user_id = ?)', [userId], function(deleteError, deleteResults) {
            if (deleteError) {
                console.error(deleteError);
                return res.status(500).send(deleteError);
            }

            dbCon.query('DELETE FROM reservations WHERE user_id = ?', [userId], function(deleteError, deleteResults) {
                if (deleteError) {
                    console.error(deleteError);
                    return res.status(500).send(deleteError);
                }

                console.log('Reservation deleted successfully');
                req.session.userId = userId;
                res.redirect('/reservation');
            });
        });
    });
});

function calculateLengthOfStay(start, end) {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

module.exports = router;
