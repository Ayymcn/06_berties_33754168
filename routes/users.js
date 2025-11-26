// Creating a new router
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login') // redirect to the login page
    } else {
        next(); // move to the next middleware function
    }
}

// Adding route to list all users
router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render('listusers.ejs', { availableUsers:result });
    });
});

// adding logout route
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/')
        }
        res.render('logout.ejs');
    })
})

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

// Displaying login page
router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

// Handling login form submission
router.post('/loggedin', function (req, res, next) {
    // forcing inputs to strings to prevent crashes
    let username = String(req.body.username || '');
    let password = String(req.body.password || '');
    // finding user in database
    let sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, results) => {
        if (err) {
            return next(err);
        }

        // checking if user exists
        if (results.length > 0) {
            // getting the hashed password from the database and storing it in user
            let user = results[0];
            let now = new Date();
            
            // Security check: is the account locked ?
            if (user.locked_until && new Date(user.locked_until) > now) {
                // marking it in audit log
                let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                let auditData = [username, 'Fail - Account Locked'];
                db.query(auditQuery, auditData, (err, result) => {
                    if (err) {
                        return next(err);
                    }
                // taking to account locked page
                res.render('lockedout.ejs');
            });
                return; // stopping further processing
            }
            // checking the hashed password
            bcrypt.compare(password, user.hashedPassword, function(err, isMatch) {
                if (err) {
                    return next(err);
                }
                if (isMatch == true) {
                    // passwords match & sudit successful login, (reseting counter to 0)
                    let resetQuery = "UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?"; 
                    db.query(resetQuery, [user.id]);

                    let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                    db.query(auditQuery, [username, 'Success'], (err, result) => {
                        if (err) {
                            return next(err);
                        }
                    
                    // saving user session when login is successful
                    req.session.userId = req.body.username;
                    
                    // taking to logged in page
                    res.render('loggedin.ejs', { user: user });
                    });
                }
                else {
                    // passwords don't match & audit failed login
                    let attempts = user.failed_attempts + 1;
                    let updateQuery = "UPDATE users SET failed_attempts = ? WHERE id = ?";
                    let queryParams = [attempts, user.id];

                    // if it is the third time, lock the account for one minute
                    if (attempts >= 3) {
                        let lockUntil = new Date(now.getTime() + 1 * 60000); 
                        updateQuery = "UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?";
                        queryParams = [attempts, lockUntil, user.id];
                    }
                    db.query(updateQuery, queryParams, (err, result) => {
                        if (err) {
                            return next(err);
                        }
                        let auditAction = (attempts >= 3) ? 'Fail - Account Locked' : 'Fail - Password';
                        let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                        db.query(auditQuery, [username, auditAction]);
                        // taking to wrong password page
                        res.render('wrongpassword.ejs');
                    });
                }
            });
        }
        else {
            // user not found in database
            let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
            auditData = [username, 'Fail - No User'];
            db.query(auditQuery, auditData, (err, result) => {
            res.render('notfound.ejs');
        });
        }
    });
});

// Adding route to view login audit log (only logged in users can view the audit log)
router.get('/audit', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM login_audit ORDER BY attempt_time DESC";
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render('audit.ejs', { auditData: result });
    });
});

// Adding route to delete a user (only logged in users can delete users)
router.post('/delete', redirectLogin, function (req, res, next) {
    let sqlquery = "DELETE FROM users WHERE id = ?";
    let userId = req.body.userId;
    db.query(sqlquery, [userId], (err, result) => {
        if (err) {
            return next(err);
        }
        // redirecting the confirmation page
        res.render('userdeleted.ejs');
    });
});

// Exporting the router object so index.js can access it
module.exports = router
