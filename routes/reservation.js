var express = require('express');
var router = express.Router();
var con = require("../lib/database")

//get user_id
function getUserID(req, res, user, site, start, end, memo, pcs){
    let sql="CALL get_by_username(?);"
    con.query(sql, [user], function (err, result) {
        if (err) {
          throw err;
        } else {
          console.log("reservation.js: Call get_by_username\n", user)

          const uid = result[0][0]['user_id'];
          console.log('DL: user_id=', uid);
          checkDates(req, res, uid, site, start, end, memo, pcs)
        
        }
      });
}

function checkDates(req, res, uid, site, start, end, memo, pcs){
    //  (date2.getTime() – date1.getTime() ) / 86400000 = number of days between two dates

    let s = new Date(start);
    let e = new Date(end);

    const length_of_stay = ((e.getTime()- s.getTime() )/86400000);

    //If start and end are between april and october
    let curdate = new Date();
    if(((s.getTime()- curdate.getTime())/2419200000)<7){




        if((s.getMonth() >= 3 && e.getMonth() <= 9)){
        // if start = april 1st and end  = october 15
        //check length of stay is within restrictions
           



            if(e.getMonth()==9 && e.getDate() < 15){
                if((pcs=="No" && ((e.getTime()- s.getTime() )/86400000) <= 14) || (pcs==="In" && ((e.getTime()- s.getTime() )/86400000) <=30) || (pcs==="Out")){
                    //call reservation
                    let sql="CALL insert_reservation(?, ?, ?, ?, ?, ?, ?, @result); SELECT @result;"
                    con.query(sql, [site, length_of_stay, s, e, pcs, uid, memo],function (err, result) {
                        if (err) {
                        console.log(err.message)
                        throw err;
                        } else {
                        const resresult = result[1][0]['@result'];

                        console.log('DL: Reservation ID: ', resresult);
                        if(resresult!==0){
                            req.session.resID = resresult;
                            //res.redirect('/payment');
                            req.session.resID = resresult;
                            res.redirect('/payment?reservation_id=${resresult}');
                        }
                        else if(resresult===0){
                                res.render('reservation', {message: "Dates not available wtf", loggedIn: req.session.loggedIn || false});
                        }
                        }
                    });
                }
            
            }
            else if(e.getMonth() < 9 && e.getMonth() >=3){
                if((pcs=="No" && ((e.getTime()- s.getTime() )/86400000) <= 14) || (pcs==="In" && ((e.getTime()- s.getTime() )/86400000) <=30) || (pcs==="Out")){
                        //call reservation
                        let sql="CALL insert_reservation(?, ?, ?, ?, ?, ?, ?, @result); SELECT @result;"
                        con.query(sql, [site, length_of_stay, s, e, pcs, uid, memo],function (err, result) {
                            if (err) {
                            console.log(err.message)
                            throw err;
                            } else {
                            const resresult = result[1][0]['@result'];
                            console.log('DL: Reservation ID: ', resresult);
                            if(resresult!==0){
                                //res.redirect('/payment');
                                req.session.resID = resresult;
                                res.redirect('/payment?reservation_id=${resresult}');
                            }
                            else if(resresult===0){
                                   // res.render('reservation', {message: "Dates not available"});
                                   getSiteSizes(req, res, req.body.trailersize, 0, 'Dates not available');
                            }
                            }
                        });
                    }
                    else{
                        //res.render('reservation', {message:"Dates expand past the current stay restrictions"})
                        getSiteSizes(req, res, req.body.trailersize, 0, 'Dates expand past the current stay restrictions');
                    }
                }
        }//s>=3 e <=9
        else if(e.getMonth() > 3 && e.getMonth()< 9){
                if((pcs=="No" && ((e.getTime()- s.getTime() )/86400000) <= 14) || (pcs==="In" && ((e.getTime()- s.getTime() )/86400000) <=30) || (pcs==="Out")){
                    //call reservation
                    let sql="CALL insert_reservation(?, ?, ?, ?, ?, ?, ?, @result); SELECT @result;"
                    con.query(sql, [site, length_of_stay, s, e, pcs, uid, memo],function (err, result) {
                        if (err) {
                        console.log(err.message)
                        throw err;
                        } else {
                        const resresult = result[1][0]['@result'];
                        console.log('DL: Reservation ID: ', resresult);
                        if(resresult!==0){
                            //res.redirect('/payment');
                            req.session.resID = resresult;
                            res.redirect('/payment?reservation_id=${resresult}');
                        }
                        else if(resresult===0){
                                //res.render('reservation', {message: "Dates not available 2"});
                                getSiteSizes(req, res, req.body.trailersize, 0, 'Dates not available');
                        }
                        }
                    });
                }
        }//(s>3 && < 9)
        else if(s.getMonth() > 3 && s.getMonth() < 9){
                if((pcs=="No" && ((e.getTime()- s.getTime() )/86400000) <= 14) || (pcs==="In" && ((e.getTime()- s.getTime() )/86400000) <=30) || (pcs==="Out")){
                    //call reservation
                    let sql="CALL insert_reservation(?, ?, ?, ?, ?, ?, ?, @result); SELECT @result;"
                    con.query(sql, [site, length_of_stay, s, e, pcs, uid, memo],function (err, result) {
                        if (err) {
                        console.log(err.message)
                        throw err;
                        } else {
                        const resresult = result[1][0]['@result'];
                        console.log('DL: Reservation ID: ', resresult);
                        if(resresult!==0){
                            //res.redirect('/payment');
                            req.session.resID = resresult;
                            res.redirect('/payment?reservation_id=${resresult}');
                        }
                        else if(resresult===0){
                                //res.render('reservation', {message: "Dates not available 3"});
                                getSiteSizes(req, res, req.body.trailersize, 0, 'Dates not available');
                        }
                        }
                    });
                }
        }
        else{
            //call reservation because were outside restriction dates
            let sql="CALL insert_reservation(?, ?, ?, ?, ?, ?, ?, @result); SELECT @result;"
                    con.query(sql, [site, length_of_stay, start, end, pcs, uid, memo],function (err, result) {
                        if (err) {
                        console.log(err.message)
                        throw err;
                        } else {
                            const resresult = result[1][0]['@result'];
                            console.log('DL: Reservation ID: ', resresult);
                            if(resresult!==0){
                                //res.redirect('/payment');
                                req.session.resID = resresult;
                                res.redirect('/payment?reservation_id=${resresult}');
                            }
                            else if(resresult===0){
                                //res.render('reservation', {message: "Dates not available 4"});
                                getSiteSizes(req, res, req.body.trailersize, 0, 'Dates not available');
                            }
                            
                        }
                    });
        }
    }
     else if(((s.getTime()- curdate.getTime())/2419200000)>=7){
        //res.render('reservation', {message:"Cannot make reservation more than 7 months in advance"})
        getSiteSizes(req, res, req.body.trailersize, 0, 'Cannot reserve more than 7 months in advance');
    }
    else{
        //res.render('reservation', {message: "please give all information for the reservation"})
        getSiteSizes(req, res, req.body.trailersize, 0, 'Please fill out all reservation information');
    }
    

}


function getSiteSizes(req, res, size, site, message){
    let sql="CALL get_trailer_size(?);"
    con.query(sql, [size], function(err, rows){
        if(err){
            throw err;
        }
        else{
            console.log(rows[0]['length']);
            getSites(req, res, rows[0]['length'], rows[0][1]['length'], site, message);
        }
    });
}

function getSites(req, res, size1, size2, site, message){
    let sql="CALL get_site_by_size(?, ?);"
    con.query(sql, [size1, size2], function(err, rows){
        if(err){
            throw err;
        }
        else{
            console.log(rows[0]);
            if(site<1){
                RenderPage(req, res, rows[0], 0, message);
            }
            else{
                getSiteDetails(req, res, rows[0], site, message)
            }
        }
    });
}

function RenderPage(req, res, rows, details, message){
    if(details){
       res.render('reservation', {data: rows.rows, info: true, details: rows.details, message: message, loggedIn:req.session.loggedIn || false} ) 
    }
    else{
        res.render('reservation', {data: rows, info: false, message: message, loggedIn: req.session.loggedIn || false})
    }
    
}

// function getRentTrailers(res, results){

//     let sql="Call get_avail_rent_trailer();"
//     con.query(sql, function(err, rows){
//         if(err){
//             throw err;
//         }
//         else{
//             for(var i =0 ; i< rows[0].length; i++){
//                 results[0].push(rows[0][i]);
//             }
//             res.render('reservation', {data: results[0]} )
            
//         }
//     });
// }


// function getDryStorage(res){
//     let sql="CALL get_avail_dry();"
//     con.query(sql, function(err, rows){
//         if(err){
//             throw err;
//         }else{
//             getTrailers(res, rows);
//         }
//     });
// }

// function getTent(res){
//     let sql="CALL get_avail_tent();"
//     con.query(sql, function(err, rows){
//         if(err){
//             throw err;
//         }else{
//             getTrailers(res, rows);
//         }
//     });
// }

// function getTrailers(res, results){
//     let sql="CALL get_avail_trailer();"
//     con.query(sql, function(err, rows){
//         if(err){
//             throw err;
//         }else{
//             for(var i =0 ; i < rows[0].length; i++){
//                 results[0].push(rows[0][i]);
//             }
//             res.render('reservation', {data:results[0]})
//         }
//     });
// }

//req , res, rows, details, msg

function getSiteDetails(req, res, data, site, msg){
    let sql="CALL get_site_details(?);"
    con.query(sql, [site], function(err, rows){
        if(err){
            throw err;
        }else{
            console.log(rows);
            if(data[0].length> 0){
                let results=[];
                results.rows=data; 
                results.details=rows[0];
                RenderPage(req, res, results, 1, msg);
            }
         
            //res.render('reservation', {details: rows})
        }
    })
}


/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("reservation.js: GET");

    console.log("trailersize: ", req.body.trailersize)
    getSiteSizes(req, res, 25, 0, '');
    //req.session.siteType="trailer"
    // if(req.session.siteType=="trailer"){
    //     //gets site that fit trailer size best
    //     //as well as the rent trailer sites if theyre available
    //     getSiteSizes(res, 25);
    // }
    // else if(req.session.siteType=="tent"){
    //     getTent(res);
    // }
    // else if(req.session.siteType=="Dry Storage"){
    //     getDryStorage(res);
    // }
});

router.post('/', function(req, res, next) {
    if(req.body.reservebool){
        console.log("reservation.js: POST processing reservation")
        const s= new Date(req.body.fromDate);
        const e= new Date(req.body.toDate);
        var hDate=new Date();
        var refDate=new Date(); 
        refDate.setTime(hDate.getTime() - 129600000);

        if(s < refDate){
            //res.render('reservation', {message:"Please enter a valid date" }); 
            getSiteSizes(req, res, req.body.trailersize, req.body.selectsite, 'Please enter a valid date')
        }
        else if(e< s){
            //res.render('reservation', {message:"Please check the input and enter a valid date" }); 
            getSiteSizes(req, res, req.body.trailersize, req.body.selectsite, 'Please check the input and enter a valid date')
        }
        else if((s> refDate)&& e>s){
            const note = req.body.resNote;
            if(req.body.resNote!="" || note.length<=0){
                const memo="";
                const site = req.body.selectsite;
                const start = req.body.fromDate;
                const end = req.body.toDate;
                const pcs = req.body.pcssub;
                console.log("Session user", req.session.username)
                if(req.session.username){
                    getUserID(req, res, req.session.username, site, start, end, memo, pcs);
                }
                else{
                    getSiteSizes(req, res, req.body.trailersize, req.body.selectsite, 'Must be logged in to make a reservation')
                }
                
            }
            else{
                const memo = req.body.resNote;
                const site = req.body.selectsite;
                const start = req.body.fromDate;
                const end = req.body.toDate;
                const pcs = req.body.pcssub;
                console.log("Session user", req.session.username)

                if(req.session.username){
                    getUserID(req, res, req.session.username, site, start, end, memo, pcs);
                }
                else{
                    getSiteSizes(req, res, req.body.trailersize, req.body.selectsite, 'Must be logged in to make a reservation')
                }
                //console.log("Reservation ID +: " + req.session.resID);

            }
        }
        
    }
    else if(req.body.changebool){
        console.log("reservation.js: processing change of password")
        res.redirect('/changePassword');
    }
    //selected something else
    else if(req.body.getDetails){
        console.log("reservation.js: processing get site details")
        const site = req.body.site;
        getSiteSizes(req, res, req.body.trailersize, site, '');

    }
    console.log("reservation.js: Finished all Post Checks");
        
});
module.exports = router;