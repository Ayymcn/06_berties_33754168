// Importing libraries
const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/books', function (req, res, next) {
    // query database
    let sqlquery = "SELECT * FROM books WHERE 1=1"
    let params = []
    let sortClause = ''

    // search by title
    if (req.query.search) {
        sqlquery += ' AND name LIKE ?';
        params.push(`%${req.query.search}%`);
        //console.log('Search param:', req.query.search);
    }

    // search by minimum price
    if (req.query.minprice) {
        sqlquery += ' AND price >= ?';
        params.push(parseFloat(req.query.minprice));
        // console.log('Min price:', parseFloat(req.query.minPrice));
    }

    // search by maximmum price
    if (req.query.max_price) {
        sqlquery += ' AND price <= ?';
        params.push(parseFloat(req.query.max_price));
        // console.log('Max price:', parseFloat(req.query.maxPrice));
    }

    // sorting by either name or price
    if (req.query.sort === 'name') {
        sortClause = ' ORDER BY name ASC';
    } else if (req.query.sort === 'price') {
        sortClause = ' ORDER BY price ASC';
    }

    const fullQuery = sqlquery + sortClause;

    // debugging tools
    // console.log('Final SQL:', sqlquery);
    // console.log('Params:', params);

    // execute the sql query
    db.query(fullQuery, params, (err, results) => {
        // return results as a json object
        if (err) {
            res.json(err);
            return next(err);
        }
        
        else {
            res.json({
                success: true,
                count: results.length,
                data: results,
                filters: {
                    search: req.query.search || null,
                    minprice: req.query.minPrice || null,
                    maxprice: req.query.maxPrice || null,
                    sort: req.query.sort || null 
                },
                // debug: {
                    //sql: sqlquery,
                    //params: params
                //}
            });
        }
    })
})

module.exports = router;