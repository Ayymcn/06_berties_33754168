// Creating a new router
const express = require("express")
const router = express.Router()

//-- ROUTE HANDLERS --
router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    let keyword = req.query.search_text;
    // For advanced search logic we use 'LIKE',
    // The % is a wildcard!
    // 'World' -> finds exactly word 'World'
    // '%World% -> finds words including it, eg: 'Brave New World''
    // (pretty close to the regex idea of '.*World.*')
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchterm = '%' + keyword + '%';
    // executing the query
    db.query(sqlquery, [searchterm], (err, result) => {
        if (err) {
            next(err)
        }
        // Rendering the the new result page, passing in the list of books + the keyword
        res.render('search-result.ejs', {
            availableBooks: result,
            search_text: keyword
        });
        }
    );
});

router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM books";
    // executing the query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        } 
        res.render('list.ejs', { availableBooks:result })
    });
});

router.get('/addbook', function(req, res, next){
    res.render('addbook.ejs')
});

// Adding post route to save data
router.post('/bookadded', function(req, res, next){
    // saving to the database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)"
    // executing the query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else {
            res.render('book-added', 
                { name: req.body.name, price: req.body.price}
            );
        }
    });
});

// Adding a post route to delete a book
router.post('/delete', function(req, res, next){
    // getting the book id
    let bookid = req.body.bookId;
    let sqlquery = "DELETE FROM books WHERE id = ?";
    // executing the query
    db.query(sqlquery, [bookid], (err, result) => {
        if (err) {
            next(err)
        }
        else{
            res.render('delete-confirm.ejs');
        }
    });
});

// Bargain books route
router.get('/bargainbooks', function(req, res, next){
    let sqlquery = "SELECT * FROM books WHERE price < 20.00";
    // executing the query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render('bargainbooks.ejs', { bargainBooks:result });
    });
});

// Exporting the router object so index.js can access it
module.exports = router
