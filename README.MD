# Bertie's Books - Web App

This is a simple web application for an online bookshop, "Bertie's Books," built with Node.js, Express, EJS, and a MySQL database.

This project was developed as part of a web development lab to practice database integration, routing, and dynamic page rendering.

## 🚀 Features

* **View All Books**: A complete list of all books available in the database.
* **Add Books**: A form to add new books (with name and price) to the database.
* **Delete Books**: A "Delete" button on the book list to remove entries.
* **Search Books**: An advanced search page that finds books with partial matches on the title.
* **Bargain Books**: A special page that only lists books priced under £20.

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Frontend**: EJS (Embedded JavaScript templates)
* **Database**: MySQL (using the \`mysql2\` package)

## 📦 How to Run

1.  **Clone the repository:**
    \`\`\`bash
    git clone https://github.com/Ayymcn/06_berties_33754168
    cd 06_berties_33754168
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Set up the Database:**
    * Make sure you have a local MySQL server running.
    * Log in to MySQL and run the \`create_db.sql\` script to create the \`berties_books\` database, tables, and the \`berties_books_app\` user.
    \`\`\`bash
    # From the mysql> prompt
    source create_db.sql;
    \`\`\`
    * You may also want to run \`insert_test_data.sql\` to add some initial books.

4.  **Run the application:**
    \`\`\`bash
    node index.js
    \`\`\`

5.  Open your browser and navigate to \`http://localhost:8000\`.

## Deployment

This application is also configured for deployment on a remote Ubuntu VM. To deploy changes:

1.  Push local commits to the GitHub repository:
    \`\`\`bash
    git push
    \`\`\`
2.  SSH into the remote VM.
3.  Navigate to the project directory and pull the latest changes:
    \`\`\`bash
    cd 06_berties_33754168
    git pull
    \`\`\`
4.  Restart the application (e.g., using PM2):
    \`\`\`bash
    pm2 restart index
    \`\`\`
