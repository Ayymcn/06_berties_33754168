#!/usr/bin/env bash
#
# Bertie's Books - Secure Bookshop App & Public API
#
# A secure, multi-user bookshop management web application and open REST API.
# Built with Node.js, Express, MySQL, EJS. Features strong authentication,
# input validation/sanitisation, audit logging, and external API integration.
#

## Features & Technologies

* Node.js + Express: Server, routing, sessions, REST API
* MySQL: User/book/audit data storage
* EJS: Dynamic HTML templating
* bcrypt: Password hashing & salting
* express-validator & express-sanitizer: Input validation and XSS prevention
* dotenv: Safe environment variable configuration
* Weather API: Live OpenWeatherMap integration
* REST API: Filter, search, and sort books via /api/books

## Installation & Setup

# 1. Clone the repository
git clone github.com/ayymcn/06_berties_33754168
cd 06_berties_33754168

# 2. Install Node.js dependencies
npm install
npm install request

# 3. Configure environment variables
# Create .env file in root directory:
cat > .env << EOF
DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=qwertyuiop
DB_NAME=berties_books
OPENWEATHER_API_KEY=your_api_key_here
EOF

# 4. Database setup (run these in MySQL)
mysql -u root -p < create_db.sql
mysql -u root -p < patch_users_table.sql
mysql -u root -p < insert_test_data.sql

# 5. Grant database user privileges
mysql -u root -p -e "
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
FLUSH PRIVILEGES;
"

# 6. Start the application
node index.js
# Or for background run:
# forever start index.js

## Security Features

* Passwords: bcrypt-hashed, never stored plain text
* Authentication: Session-based with account lockouts (3 failed attempts = 1min lock)
* Audit Trail: Logs all logins, logouts, failures, and lockouts
* Input Protection: All forms validated and sanitised (XSS prevention)
* SQL Safety: Parameterized queries prevent injection attacks
* Config: All secrets in .env (never committed to git)

## Route & API Overview

### Main Application Routes
| Route | Description |
|-------|-------------|
| `/` | Home page (public) |
| `/about` | About the system |
| `/books/list` | List all books |
| `/books/search` | Search books (validated) |
| `/books/addbook` | Add books (server-side validation) |
| `/books/bargainbooks` | Books under £20 |
| `/users/register` | Secure user registration |
| `/users/login` | Secure login |
| `/users/logout` | Destroy session |
| `/users/list` | List users (restricted) |
| `/users/audit` | Audit log (admin only) |
| `/weather` | Live weather by city |

### REST API Endpoints
| Endpoint | Description |
|----------|-------------|
| `GET /api/books` | All books as JSON |
| `GET /api/books?search=term` | Search by book title |
| `GET /api/books?minprice=5` | Filter min price |
| `GET /api/books?max_price=10` | Filter max price |
| `GET /api/books?sort=name` | Sort by name (A-Z) |
| `GET /api/books?sort=price` | Sort by price (low-high) |

# Combined example:
# curl "http://localhost:8000/api/books?search=brave&minprice=5&max_price=20&sort=price"

## Weather API Integration

* Live city weather at `/weather` (uses OpenWeatherMap)
* Supports any city: `/weather?city=London`
* API key stored securely in .env
* User-friendly error messages for invalid cities
* Handles network errors and API rate limits

## Usage & Testing

# 1. Register a new user
# Visit: http://localhost:8000/users/register
# Use strong password (8+ chars, mix of types)

# 2. Login
# Visit: http://localhost:8000/users/login
# Test credentials: username='gold', password='smiths'

# 3. Test book features
# List: http://localhost:8000/books/list
# Search: http://localhost:8000/books/search
# Add book: http://localhost:8000/books/addbook
# Bargains: http://localhost:8000/books/bargainbooks

# 4. Test security features
# XSS test: Try '<script>alert(1)</script>' in any form
# Lockout: Enter wrong password 3x for any user
# Logout: http://localhost:8000/users/logout

# 5. Test API endpoints
curl http://localhost:8000/api/books
curl "http://localhost:8000/api/books?search=world"
curl "http://localhost:8000/api/books?minprice=10&max_price=20"
curl "http://localhost:8000/api/books?sort=price"

# 6. Test weather
curl "http://localhost:8000/weather?city=Manchester"
curl "http://localhost:8000/weather?city=Edinburgh"
curl "http://localhost:8000/weather?city=Belfast"

## Security Testing Checklist

[ ] Register with strong password (8+ chars)
[ ] Login with test user 'gold'/'smiths'
[ ] XSS attempt blocked in all forms
[ ] Account lockout after 3 failed logins
[ ] Logout destroys session properly
[ ] All API responses are JSON (no HTML)
[ ] SQL parameters prevent injection
[ ] .env file excluded from git (check .gitignore)

## Troubleshooting

# Database connection issues
# Check .env credentials and MySQL user privileges
mysql -u berties_books_app -p berties_books -e "SHOW TABLES;"

# API not filtering correctly
# Check URL parameter names exactly match (minprice, max_price)
curl -v "http://localhost:8000/api/books?minprice=5"

# Weather not working
# Verify OPENWEATHER_API_KEY in .env
# Test API key: curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"

# Missing dependencies
npm install express mysql2 ejs bcrypt express-validator express-sanitizer dotenv request

## File Structure

.
├── index.js              # Main Express app
├── routes/
│   ├── books.js         # Book routes (HTML)
│   ├── main.js          # Home, about routes
│   ├── api.js           # REST API endpoints
│   └── users.js         # User auth routes
|   └── weather.js       # Weather route
├── views/               # EJS templates
├── public/              # CSS file
├── sql/                 # Database setup scripts
│   ├── create_db.sql
│   ├── patch_users_table.sql
│   └── insert_test_data.sql
├── .env                 # Secrets (NOT in git!)
├── .gitignore           # Excludes .env, node_modules
└── README.md            # This file

## API Response Format

Success (200):
