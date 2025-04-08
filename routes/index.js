var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  // Pass loggedin status to the template
  username = req.session.username;
  res.render('index', { loggedIn: req.session.loggedIn || false });
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
          throw err;
        }
        res.redirect('/');
    });
});

module.exports = router;
