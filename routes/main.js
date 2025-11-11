// Creating a new router
const express = require("express")
const router = express.Router()

// -- ROUTE HANDLERS--
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

// Exporting the router object so index.js can access it
module.exports = router