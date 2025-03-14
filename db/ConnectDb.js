const { Client } = require("pg");

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1234",
  database: "viberoom",
});



module.exports = db;