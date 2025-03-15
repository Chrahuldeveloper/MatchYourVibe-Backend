const signupRouter = require("express").Router();
const db = require("../db/ConnectDb");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "dskvs23rk3nroi82rwef0@w019i2r9ks@j01v0iwjug320220398sddskvs23rk3nroi82rwef0";

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

    const insertQuery = "INSERT INTO users (email) VALUES ($1) RETURNING *";

    const values = [Email];

    const result = await db.query(insertQuery, values);

    console.log("user saved ", result.rows);
    const token = jwt.sign({ email: Email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(201)
      .json({ message: "User created successfully", token });
  } catch (error) {
    res.send(error.message);
    console.log(error);
  }
});

module.exports = signupRouter;
