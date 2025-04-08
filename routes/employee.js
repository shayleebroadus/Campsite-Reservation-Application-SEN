var express = require('express');
var router = express.Router();
var con = require("../lib/database")


function getReport(req, res, type){

    if(type=="occupancy"){
        let sql="CALL get_occupancy()"
        con.query(sql, function(err, rows){
            if(err){
                throw err; 
            }
            else{
                console.log(rows[0])
                let data=[];
                data.rows=rows[0];
                data.type="occupancy"
                res.render('employee', {records: data, loggedIn: req.session.loggedIn || false});
            }
        });
    }
    else if(type=="vacancy"){
        console.log("Vacancy")
        let sql="CALL get_vacancy();"
        con.query(sql, function(err, rows){
            if(err){
                throw err; 
            }
            else{
                console.log(rows)
                let data=[];
                data.rows=rows[0];
                data.type="vacancy"
                res.render('employee', {records: data, loggedIn: req.session.loggedIn||false});
            }
        });
    }
    
}

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("employee.js: GET");
    //get current and upcoming reports
    //const type = req.body.report;
    getReport(req, res, 'occupancy');
    
});

// /* POST page. */
router.post('/', function(req, res, next) {
    
    console.log("employeehome.js: POST");
    var Breport = req.body.getreport;
    var Occ = req.body.selectOccupied;
    var Vacant = req.body.selectVacant;
    var changepass= req.body.changepassword;
    console.log(Breport);
    console.log(Occ);
    console.log(Vacant);
    //get report according to filter
    if(Breport){
        var report=req.body.report;
        getReport(req, res, report);
    }
    else if(Vacant){
        console.log("Vacant select")
        req.session.siteView = req.body.btnVacant;
        //go to reservation page on 
        res.redirect("/reservation");
    }
    else if(Occ){
        console.log("occupied select")
        //send to edit reservation page
        req.session.siteView = req.body.btnOccupied;
        res.redirect("/editReservation");
    }
    else if(changepass){
        res.redirect("/changePassword");
    }
    //get records by search 
    //change password
    
});

module.exports = router;