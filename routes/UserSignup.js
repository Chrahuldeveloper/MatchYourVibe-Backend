const signupRouter = require("express").Router();
const db = require("../db/ConnectDb");
signupRouter.get("/signup", (req, res) => {
  res.send("signup user");
});

const checkEmail = async (email) => {
  try {
    const getquery = "SELECT * FROM users WHERE email = $1";
    const value = [email];
    const res = await db.query(getquery, value);
    return res.rows.length > 0;
  } catch (error) {
    console.log(error);
  }
};

signupRouter.post("/signup", async (req, res) => {
  try {
    const { Email } = req.body;
    const emailExists = await checkEmail(Email);
    if (emailExists) {
      return res.status(400).send("Email already exists");
    }
    const insertQuery =
      "INSERT INTO users (id,email) VALUES ($1, $2) RETURNING *";

    const values = [1, Email];

    const result = await db.query(insertQuery, values);

    console.log("user saved ", result.rows);

    return res.sendStatus(200);
  } catch (error) {
    res.send(error.message);
    console.log(error);
  }
});

module.exports = signupRouter;
