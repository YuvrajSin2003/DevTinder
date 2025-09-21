const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const moddle = require("./middleware/auth");


app.use(express.json());
app.use(cookieParser()); // middleware to read cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

 
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
