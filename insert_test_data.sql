# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;
INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES('gold', 'berties', 'books', 'bertiesbks@gold.ac.uk', '$2b$10$fDpNAlVy3cXEkzYESfQUQeKUautzdfCjgRqg9fj1G8t4xb/TOiUEG'), ('qwerty', 'q', 'w', 'qwerty@gold.ac.uk', '$2b$10$eDC1RBR5kQgHv7aLpMI.WeA8aTY1sv4zaIa8u5p.8aBl0D6lNshnu');