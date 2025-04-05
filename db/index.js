const mysql = require("mysql2/promise");
const dbconfig = require("../dbconfig");
console.log(dbconfig);
const conn = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

module.exports = conn;
