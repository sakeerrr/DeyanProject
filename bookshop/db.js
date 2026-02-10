require("dotenv").config();  
console.log("DB_PASS =", process.env.PASS);

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "process.PASS",
  database: "bookshop",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
