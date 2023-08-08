const mysql = require("mysql2");

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "adminrichesh@123",
    database : "social"
})

module.exports = db;