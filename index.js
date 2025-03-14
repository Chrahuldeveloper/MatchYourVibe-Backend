const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db/ConnectDb");
const generateGitFile = require('giv-gitignore');

app.use(cors());
generateGitFile();

const connectingDB = async () => {
  try {
    await db.connect();
    console.log("db connected");

    const insertQuery =
      "INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *";
    const values = [1, "John Doe"];

    const result = await db.query(insertQuery, values);
    console.log("Inserted user:", result.rows[0]);
  } catch (error) {
    console.log(error);
  }
};
db.query("Select * from user", (err, res) => {
  if (err) {
    console.log(err);
  }
  console.log(res.rows);
});

app.listen(5000, () => {
  connectingDB();
  console.log("server is running");
});
