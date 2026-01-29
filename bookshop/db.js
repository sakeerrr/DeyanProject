const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "bk04090711",
  database: "bookshop",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
