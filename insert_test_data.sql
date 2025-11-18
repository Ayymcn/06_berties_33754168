# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;
INSERT INTO users (username, first_name, last_name, email, password) VALUES('gold', 'berties', 'books', 'bertiesbks@gold.ac.uk', 'smiths'), ('qwerty', 'q', 'w', 'qwerty@gold.ac.uk', 'qwerty'), ('trydeleteme', 'try', 'deleteme', 'trydm@gold.ac.uk', 'trydeleteme');