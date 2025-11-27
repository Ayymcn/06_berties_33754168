# Bertie's Books - Secure Web Application ...................................

A secure multi-user bookshop management web app (Labs 8/9).
Built with Node.js, Express, MySQL, EJS.
Implements password hashing, safe login/logout, audit logging, account lockout, input validation, input sanitisation (XSS protection), and easy, repeatable deployment.

...........................................................................

# Technologies Used
* Node.js & Express             : Routing, middleware, sessions
* MySQL                         : Database for users, books, login audits
* EJS                           : Dynamic HTML templating
* bcrypt                        : Secure password storage
* express-validator             : Validates all forms server-side
* express-sanitizer             : Blocks XSS; scrubs user input
* dotenv                        : Loads DB credentials from .env file
* express-session               : Handles authentication and stateful login/logout

...........................................................................

# Installation & Setup

1. Clone the Repository
    $ git clone <repo-url>
    $ cd 06_berties_33754168

2. Install Dependencies
    $ npm install

3. Set Environment Variables
   - Create a `.env` file in your project root.
   - Add either:
        BB_HOST=localhost
        BB_USER=berties_books_app
        BB_PASSWORD=qwertyuiop
        BB_DATABASE=berties_books
     Or:
        DB_HOST=localhost
        DB_USER=berties_books_app
        DB_PASSWORD=qwertyuiop
        DB_NAME=berties_books

4. Database Setup
   - Drop the old database if needed (for a fresh install).
   - In MySQL, run:
        mysql -u root -p < create_db.sql
        mysql -u root -p < patch_users_table.sql      # update user table if needed
        mysql -u root -p < insert_test_data.sql

5. Grant Database User Privileges (in MySQL shell)
      CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
      GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';

6. Run the Application
    $ node index.js
   (or for VM/background run:)
    $ npx forever index.js

...........................................................................

# Security Features & Activities

* Password Hashing
    - User passwords are hashed and salted before storage via bcrypt; never stored plain.
    - Password comparison at login is done securely with bcrypt.compare.

* Secure Authentication, Session & Logout
    - Users log in securely; sessions protect user identity and prevent cross-user access.
    - Logout feature added: users can safely end their session.
    - Session destroyed on logout; no sensitive info persists.

* Account Lockout
    - After three failed login attempts, accounts are locked for 1 minute to prevent brute force.
    - Lockout status and failed login attempts stored in the users table.

* Audit Logging
    - Every login, logout, failed login, and account lockout is recorded in login_audit.
    - Audit records show timestamp, username, and activity reason.
    - Admin view for audits at '/users/audit' route.

* Input Validation
    - Registration, login, book add/search fields all validated via express-validator.
        - Email must be valid
        - Username: 5–20 characters
        - Password: minimum 8 characters for registration ('aaaaAAAA1234!' accepted)
        - Name fields: only letters and spaces
        - Book fields: validated length, allowed chars
    - Marker can always log in with 'gold'/'smiths' (login validation allows short password).

* Input Sanitisation
    - All user-entered text is sanitised with express-sanitizer before saving or showing anywhere on the site.
    - Prevents XSS: e.g., <script>alert(1)</script> becomes harmless text.
    - Passwords: validated and hashed only, never sanitized for security.

* Environment-Based Configuration
    - Supports both BB_* and DB_* sets of environment variables for credentials.
    - Credentials are NOT hard-coded anywhere.

...........................................................................

# How to Test & Mark

- Register a user with password 'aaaaAAAA1234!' (proves strong password policy).
- Log in with user 'gold', password 'smiths' (always possible for marking).
- Enter '<script>alert(1)</script>' in any field—have it removed in confirmation (proves XSS protection).
- After 3 failed login attempts, ensure account locks for 1 minute and shows lock status in audit.
- Log out to fully destroy session and prevent reuse—logout option visible on secure pages.
- All install and test steps succeed from a fresh git clone and blank DB.

...........................................................................

# Route Overview

/                   Home page (public)
/about              About the system
/books/list         List all books
/books/search       Search books
/books/addbook      Add a book (validation & sanitisation)
/books/bargainbooks List bargains (≤ £20)
/users/register     Register user (secure/validated)
/users/login        Login page
/users/logout       Log out and destroy session
/users/list         List users (admin)
/users/audit        Login & logout audit log

...........................................................................

# Troubleshooting

* If install fails, check .env, DB user grants, and rerun the SQL scripts.
* For any registration or login problems, verify you are passing validation and sanitisation in all form handlers.
* If XSS not blocked, check the use of express-sanitizer on all fields.
* If logout does not destroy session, check the session config in index.js.

...........................................................................

# Security Reasoning

- All user-facing forms validated and sanitized prior to DB insert or display
- Passwords are always validated and securely hashed (never sanitized)
- Internal fields like hashedPassword and user IDs are never displayed; sanitisation not needed
- Logout feature ensures user privacy and session integrity
- Audit log tracks all security-relevant actions (login, logout, lockouts, failures)

...........................................................................

# Usage Guide

1. Register a new user via '/users/register'. Choose a strong password (8+ chars, any mix).
2. Log in to the system—after 3 failed attempts, you'll be locked out for 1 minute.
3. Browse books ('/books/list'), add new books ('/books/addbook'), or search titles ('/books/search').
4. View bargain books under £20 at '/books/bargainbooks'.
5. As an admin, view the users list and audit logs.
6. Log out using '/users/logout'—your session is fully destroyed.
7. For testing XSS, try submitting any field with '<script>alert(1)</script>'—the script will be removed (sanitised).

...........................................................................

END OF README
