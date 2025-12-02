// Loading environment variables from .env file
require('dotenv').config();

// input sanitizer
const expressSanitizer = require('express-sanitizer');

// Importing express and ejs and mysql
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')

// Importing express session
var session = require('express-session')

// Creating the express application object
const app = express()
const port = 8000

//creating input sanitizer
app.use(expressSanitizer());

// debugging 
console.log("Checking .env variables...");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);

// Defining the database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Set locals for templates (shop name only)
app.use((req, res, next) => {
    res.locals.shopData = { shopName: "Bertie's Books" };
    next();
});

// Telling Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Setting up the body parser 
app.use(express.urlencoded({ extended: true }))

// Setting up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// -- ROUTE HANDLERS --
const mainRoutes = require('./routes/main');
const usersRoutes = require('./routes/users'); 
const booksRoutes = require('./routes/books');
const weatherRoutes = require('./routes/weather');
const apiRoutes = require('./routes/api');

// creating a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expire: 600000
    }
}))

app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/', weatherRoutes);
app.use('/api', apiRoutes);
// Adding error page route
app.get('*', function(req, res, send) {
    res.status(404).render('404.ejs');
})

// Starting the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))