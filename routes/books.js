// Creating a new router
const express = require("express")
const router = express.Router()

// Defining the route handlers for /books
router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    //searching in the database
    res.send("You searched for: " + req.query.keyword)
});

// adding new route to display all books
router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM books";
    // executing the query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } 
        res.send(result)
    });
});

// Exporting the router object so index.js can access it
module.exports = router
