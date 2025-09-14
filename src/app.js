const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validateSignUpData = require("./utils/validation"); 
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser()); 
// --------------------- AUTH MIDDLEWARE ---------------------
const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("No token, please log in");
    }

    const decoded = jwt.verify(token, "DEV@Tinder$7900");
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
};

// --------------------- SIGNUP ROUTE ---------------------
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

// --------------------- LOGIN ROUTE ---------------------
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a JWT Token
      const token = jwt.sign({ _id: user._id }, "DEV@Tinder$7900", {
        expiresIn: "7d",
      });

      // Add the token to cookies
      res.cookie("token", token, {
        httpOnly: true,   // secure against XSS
        secure: false,    // set to true in production (HTTPS)
        sameSite: "strict",
      });

      res.send("Login successful");
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).send("Login failed: " + err.message);
  }
});

// --------------------- PROFILE ROUTE ---------------------
app.get("/profile", async (req, res) => {
try{  const cookies = req.cookies;
  const {token} = cookies
  if(!token){
    throw new Error("Invalid token ");
  }
  const decodeMessage = await jwt.verify(token, "DEV@Tinder$7900"); //compare actual pass and hashed pass
  console.log(decodeMessage);
 const {_id} = decodeMessage;
 console.log("logged in user. :" + _id);
 const user = await User.findById(_id);
 if(!token){
    throw new Error("Invalid user ");
  }
  res.send(user);
}
catch(err){
  res.status(400).send("ERROR : "+ err.message);
}
});

// --------------------- DELETE USER ---------------------
app.delete("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// --------------------- UPDATE USER BY ID ---------------------
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; 
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["PhotoURL", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills && data.skills.length > 50) {
      throw new Error("Skills should not be more than 10");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log(user);
    res.send("User updated");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

// --------------------- UPDATE USING EMAIL ---------------------
app.patch("/user/email", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  try {
    await User.findOneAndUpdate({ emailId }, data, {
      runValidators: true,
    });
    res.send("User updated");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// --------------------- CONNECT DB & START SERVER ---------------------
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
