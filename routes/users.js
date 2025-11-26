const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('login'); // absolute path to avoid redirect loop issues
    } else {
        next();
    }
};

router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render('listusers.ejs', { availableUsers: result });
    });
});

router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.render('logout.ejs');
    });
});

router.get('/register', function (req, res, next) {
    res.render('register.ejs');
});

router.post('/registered', [check('email').isEmail().withMessage('Please enter a valid email address.'),
    check('username').isLength({ min:5, max:20}).withMessage('Username must be 5-20 characters.'), 
    check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long.'),
    check('first').matches(/^[A-Za-z\s]+$/).withMessage('First name must contain only letters and spaces.'),
    check('last').matches(/^[A-Za-z\s]+$/).withMessage('Last name must contain only letters and space')],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register')
    }
    else {
    const saltRounds = 10;
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err);

        let sqlquery = "INSERT INTO users (first_name, last_name, email,username, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        let newrecord = [req.body.first, req.body.last, req.body.email, req.body.username, hashedPassword];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) return next(err);
            res.render('registred.ejs', {
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                password: plainPassword,
                hashedPassword: hashedPassword
            });
        });
    });
  }
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs');
});

router.post('/loggedin', function (req, res, next) {
    let username = String(req.body.username || '');
    let password = String(req.body.password || '');
    let sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, results) => {
        if (err) return next(err);

        if (results.length > 0) {
            let user = results[0];
            let now = new Date();

            // First, check if locked
            if (user.locked_until && new Date(user.locked_until) > now) {
                let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                let auditData = [username, 'Fail - Account Locked'];
                db.query(auditQuery, auditData, (err, result) => {
                    if (err) return next(err);
                    res.render('lockedout.ejs');
                });
                return; // stop further processing!
            }

            // Check password
            bcrypt.compare(password, user.hashedPassword, function(err, isMatch) {
                if (err) return next(err);

                if (isMatch) {
                    // Reset failed_attempts & unlock in DB FIRST
                    let resetQuery = "UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?";
                    db.query(resetQuery, [user.id], (err) => {
                        if (err) return next(err);

                        let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                        db.query(auditQuery, [username, 'Success'], (err, result) => {
                            if (err) return next(err);

                            req.session.userId = req.body.username;
                            res.render('loggedin.ejs', { user: user });
                        });
                    });
                } else {
                    let attempts = user.failed_attempts + 1;
                    let updateQuery = "UPDATE users SET failed_attempts = ? WHERE id = ?";
                    let queryParams = [attempts, user.id];

                    if (attempts >= 3) {
                        let lockUntil = new Date(now.getTime() + 1 * 60000);
                        updateQuery = "UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?";
                        queryParams = [attempts, lockUntil, user.id];
                    }

                    db.query(updateQuery, queryParams, (err, result) => {
                        if (err) return next(err);

                        let auditAction = (attempts >= 3) ? 'Fail - Account Locked' : 'Fail - Password';
                        let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
                        db.query(auditQuery, [username, auditAction]);

                        if (attempts >= 3) {
                            res.render('lockedout.ejs');
                        } else {
                            res.render('wrongpassword.ejs');
                        }
                    });
                }
            });
        } else {
            let auditQuery = "INSERT INTO login_audit (username, action) VALUES (?, ?)";
            let auditData = [username, 'Fail - No User'];
            db.query(auditQuery, auditData, (err, result) => {
                res.render('notfound.ejs');
            });
        }
    });
});

router.get('/audit', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM login_audit ORDER BY attempt_time DESC";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render('audit.ejs', { auditData: result });
    });
});

router.post('/delete', redirectLogin, function (req, res, next) {
    let sqlquery = "DELETE FROM users WHERE id = ?";
    let userId = req.body.userId;
    db.query(sqlquery, [userId], (err, result) => {
        if (err) return next(err);
        res.render('userdeleted.ejs');
    });
});

module.exports = router;
