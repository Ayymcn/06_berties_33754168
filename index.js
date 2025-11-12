// Importing express and ejs and mysql
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')

// Creating the express application object
const app = express()
const port = 8000

/* 
   ISSUE FIX: because the delete link takes 
   you to /books/list in my local server, 
   when running it into vm it doesnt know it is 
   on the vm so cant find the correct format 
   /usr/..., and if changing the links here all 
   to /usr/..., the links in my local server 
   will be broken, instead we added some kind 
   of logic so that it detects which machine 
   it is working on to correctly choose the 
   link pathh (done using ai)
*/
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction ? '/usr/311' : '';
/* 
   The idea is that we check the NODE_ENV,
    if it's set on production (which we ve done 
    also on vm), it sets baseUrl to /usr/311/,
     otherwise it keeps it blank ''*/
app.use((req, res, next) => {
    res.locals.baseUrl = baseUrl;
    res.locals.shopData = {shopName: "Bertie's Books"};
    next();
});

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

if (isProduction) {
    app.use(baseUrl, mainRoutes);
    app.use(baseUrl + '/users', usersRoutes);
    app.use(baseUrl + '/books', booksRoutes);
    app.use(baseUrl, express.static(path.join(__dirname, 'public')));
    } else {
    app.use('/', mainRoutes);
    app.use('/users', usersRoutes);
    app.use('/books', booksRoutes);
    app.use(express.static(path.join(__dirname, 'public')));
    }

    if (isProduction) {
    app.get(baseUrl + '/', (req, res) => res.send('PROD: main route works!'));
}

// Starting the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))