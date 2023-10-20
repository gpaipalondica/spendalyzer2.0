Spendalyzer2.0 is a web-app that allows the user register or login and keep a track of daily spending and analyzes your expenditure and displays it as a list and a graph. 

Technologies used: React JS along with HTML, CSS and JavaScript for Frontend, MySQL for Database and Node.js for Backend.
Other concepts used: bcrypt.js for hashing and unhashing of user passwords, jsonwebtoken for user authentication and HTML5 localStorage.

Before running the code you should have a database setup in MySQL Workbench with following data:
Database name = 'spendalyzer' and 2 tables with names 'expenses' and 'users'

Table "expenses"
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int          | NO   | PRI | NULL    | auto_increment |
| Title    | varchar(255) | NO   |     | NULL    |                |
| Amount   | float        | YES  |     | NULL    |                |
| Date     | date         | NO   |     | NULL    |                |
| username | varchar(255) | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+

Table "users"
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| user_id  | int          | NO   | PRI | NULL    | auto_increment |
| username | varchar(255) | NO   | UNI | NULL    |                |
| email    | varchar(255) | NO   | UNI | NULL    |                |
| password | varchar(255) | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+


After the database is set, install the dependencies using 'npm install' and then run the command 'npm start'.
