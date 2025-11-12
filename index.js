// Importing express and ejs and mysql
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')

// Creating the express application object
const app = express()
const port = 8000

// Defining the database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'berties_books_app',
    password: 'qwertyuiop',
    database: 'berties_books',
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

app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);

// Starting the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))