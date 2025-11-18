# Bertie's Books - Secure Web Application

This project is a data-driven web application for a bookshop, developed using Node.js and MySQL. This version (Lab 7) focuses on data security, specifically implementing password hashing, secure login authentication, credential management, and audit logging.

## Technologies Used

* **Node.js & Express:** Server-side framework for handling routes and middleware.
* **MySQL:** Relational database for storing books, users, and audit logs.
* **EJS:** Templating engine for rendering dynamic HTML views.
* **Bcrypt:** Library used for hashing and salting passwords to ensure secure storage.
* **Dotenv:** Module for managing environment variables and securing database credentials.

## Installation & Setup

1.  **Install Dependencies:**
    Run the following command to install the required node modules (express, mysql, bcrypt, dotenv, etc.):
    ```bash
    npm install
    ```

2.  **Database Setup:**
    * Log into MySQL and run the `create_db.sql` script to set up the `books`, `users`, and `login_audit` tables.
    * Run `insert_test_data.sql` to populate the database with initial books and the default user ('gold').

3.  **Environment Configuration:**
    * Create a file named `.env` in the root directory.
    * Add your database credentials (see "Extension: Dotenv" below).

4.  **Run the Application:**
    ```bash
    npm start
    ```

## Security Features & Extensions

### Password Hashing
User passwords are never stored in plain text. When a user registers, their password is salted and hashed using `bcrypt` (10 salt rounds) before being inserted into the database. During login, `bcrypt.compare` is used to verify the input against the stored hash.

### Extension: Dotenv (Task 5)
To improve security, database credentials (host, username, password, database name) have been removed from the source code (`index.js`). 

* **Implementation:** I used the `dotenv` package to load these values from a separate `.env` file.
* **Usage:** In `index.js`, the database connection pool now uses `process.env.DB_USER`, `process.env.DB_PASSWORD`, etc.
* **Benefit:** This prevents sensitive passwords from being exposed in version control systems like GitHub.

### Extension: Audit Logging (Task 6)
A security mechanism has been implemented to track all access attempts to the system.

* **Database:** A table named `login_audit` was created with columns for `username`, `action`, and `attempt_time`.
* **Logic:** The login route (`/users/loggedin`) inserts a record for every attempt:
    * **Success:** Logs a successful login.
    * **Fail:** Logs the reason (e.g., "Fail - Password", "Fail - No User", "Fail - Account Locked").
* **Viewing Logs:** An administrator view is available at `/users/audit` to inspect the login history.

### Extra Research: Account Locking
As an additional security measure, I implemented an account lockout policy to prevent brute-force attacks.

* **Mechanism:** The `users` table tracks `failed_attempts` and a `locked_until` timestamp.
* **Policy:** If a user enters an incorrect password **3 times**, their account is locked for **10 minutes**.
* **Behavior:** During the lockout period, even a correct password will result in a "Locked Account" message, and the attempt is logged in the audit trail.

## Routes Overview

* `/` - Home page.
* `/about` - About page.
* `/books/list` - Lists available books.
* `/books/search` - Search for books by name or title.
* `/books/addbook` - Allows you to add a book to the list.
* `/books/bargainbooks` - Dhows you all books that is less or equal to 20pounds.
* `/users/register` - Register a new user (hashed password).
* `/users/login` - Login page.
* `/users/list` - Lists registered users (hides sensitive data).
* `/users/audit` - Displays the security login log.