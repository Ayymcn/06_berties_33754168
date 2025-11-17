// Creating a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// -- ROUTE HANDLERS --
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    // saving data in database
    const saltRounds = 10;
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }

        // storing hashed password in your database
        let sqlquery = "INSERT INTO users (first_name, last_name, email,username, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, hashedPassword];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } 
            res.render('registred.ejs', {
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                password: plainPassword,
                hashedPassword: hashedPassword
           }); 
      });                                                                         
  });
});

// Adding route to list all users
router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render('listusers.ejs', { availableUsers:result });
    });
});

// Displaying login page
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

// Handling login form submission
router.post('/loggedin', function (req, res, next) {
    let sqlquery = "SELECT * FROM users WHERE username = ?";

    db.query(sqlquery, [req.body.username], (err, results) => {
        if (err) {
            return next(err);
        }

        // checking if user exists
        if (results.length > 0) {
            // getting the hashed password from the database
            let hashedPassword = results[0].hashedPassword;

            // comparing the hashed password with the entered password
            bcrypt.compare(req.body.password, hashedPassword, function(err, isMatch) {
                if (err) {
                    return next(err);
                } 
                else if (isMatch == true) {
                    // Passwords match
                    res.render('loggedin.ejs', { user: results[0] });
                }
                else {
                    // Passwords don't match
                    res.render('wrongpassword.ejs');
                }
            });
        }
        else {
            res.render('notfound.ejs');
        }
    });
});

// Exporting the router object so index.js can access it
module.exports = router
