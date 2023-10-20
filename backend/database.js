const mysql = require('mysql2')

require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getList(){
    const [result] = await pool.query(`
    WITH DateData AS (
        SELECT
            DATE(Date) AS Date,
            JSON_ARRAYAGG(JSON_OBJECT('id', id, 'Title', Title, 'Amount', Amount, 'User', username)) AS DateData,
            SUM(Amount) AS TotalAmountPerDay
        FROM expenses
        GROUP BY DATE(Date)
        ORDER BY DATE(Date) DESC
    ),
    MonthData AS (
        SELECT
            YEAR(Date) AS Year,
            MONTH(Date) AS Month,
            JSON_ARRAYAGG(
                JSON_OBJECT('Date', Date, 'Data', DateData, 'DailyAmount', TotalAmountPerDay)) AS MonthData,
            SUM(TotalAmountPerDay) AS MonthlyAmount
        FROM DateData
        GROUP BY YEAR(Date), MONTH(Date)
    )
    SELECT
        Year,
        Month,
        MonthData,
        MonthlyAmount
    FROM MonthData
    ORDER BY Year DESC, Month DESC;`);
    return result
}

async function getListByUser(id){
    const [result] = await pool.query(`
    WITH DateData AS (
        SELECT
            DATE(Date) AS Date,
            JSON_ARRAYAGG(JSON_OBJECT('id', id, 'Title', Title, 'Amount', Amount, 'User', username)) AS DateData,
            SUM(Amount) AS TotalAmountPerDay
        FROM expenses
        WHERE username = ? -- Add the filter for the username here
        GROUP BY DATE(Date)
        ORDER BY DATE(Date) DESC
    ),
    MonthData AS (
        SELECT
            YEAR(Date) AS Year,
            MONTH(Date) AS Month,
            JSON_ARRAYAGG(
                JSON_OBJECT('Date', Date, 'Data', DateData, 'DailyAmount', TotalAmountPerDay)) AS MonthData,
            SUM(TotalAmountPerDay) AS MonthlyAmount
        FROM DateData
        GROUP BY YEAR(Date), MONTH(Date)
    )
    SELECT
        Year,
        Month,
        MonthData,
        MonthlyAmount
    FROM MonthData
    ORDER BY Year DESC, Month DESC;
    
    `, [id]);
    return result
}


async function getAllUsers(){
    const [result] = await pool.query(`SELECT * from users`)
    return result
}

async function registerUser(username, email, password){
    const [result]= await pool.query(`INSERT INTO users (username, email, password) 
    VALUES (?, ?, ?)`, [username, email, password])
    return result
}

async function createExpense(title, amount, date, username){
    const [result] = await pool.query(`
    INSERT INTO expenses (Title, Amount, Date, username)
    VALUES (?, ?, ?, ?)
    `,[title, amount, date, username])
    return result
}

async function updateExpense(title, amount, id){
    const [result] = await pool.query(`
    UPDATE expenses 
    SET Title = ?, Amount = ?
    WHERE id = ?
    `,[title, amount, id])
    return result
}

async function deleteExpense(id){
    const [result] = await pool.query(`
    DELETE FROM expenses
    WHERE id = ?
    `,[id])
    return result
}

async function getGraph(id){
    const [result] = await pool.query(`
    SELECT username, DATE_FORMAT(Date, '%Y-%m-%d') AS Date, SUM(Amount) AS DailySum, username
   FROM expenses
   WHERE Date LIKE ?
   GROUP BY Date, username;
    `,[id+'%'])
    return result
}


module.exports = {getList, getListByUser, getAllUsers, registerUser, createExpense, updateExpense, deleteExpense, getGraph}