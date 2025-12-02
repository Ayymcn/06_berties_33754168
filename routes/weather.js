// Importing libraries
const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/weather', function (req, res, next) {
    // defining api credentials
    // in order to make it safe, we can add it to the .env file, however i did hard coded it again here just in case it doesnt work on teacher's pc
    let apiKey = process.env.OPENWEATHER_API_KEY || '280f2571976df9cc12d7d887137aef67';
    let city = req.query.city || 'London';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
        if(err) {
            return next(err);
        }

        // error handling
        try {
            const data = JSON.parse(body);
            // simple check in case api returns error json
            if (data.cod && data.cod !=200 && data.cod != '200') {
                return res.render('weather', {
                    shopData: {shopName: 'Berties Books' },
                    weather: null,
                    error: data.message || 'Unable to fetch weather data.',
                    city: city
                });
            }
            res.render('weather', {
                shopData: { shopName: 'Berties Books' },
                weather: data,
                error: null,
                city: city
            });
        } catch (e) {
            return next(e);
        }
    });
});

module.exports = router;