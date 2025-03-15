const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db/ConnectDb");
const generateGitFile = require("giv-gitignore");
const signupRouter = require("./routes/UserSignup");
app.use(cors());
generateGitFile();

app.use(express.json());

const connectingDB = async () => {
  try {
    await db.connect();
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
};

app.use("/", signupRouter);
app.listen(5000, () => {
  connectingDB();
  console.log("server is running");
});
