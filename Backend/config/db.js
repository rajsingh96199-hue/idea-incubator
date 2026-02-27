const mysql = require("mysql2");

// Create connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "incubator"
}).promise();

module.exports = pool;
