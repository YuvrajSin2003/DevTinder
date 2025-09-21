const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const moddle = require("./middleware/auth");
const { userAuth } = require("./middleware/auth");
app.use(express.json());
app.use(cookieParser()); // middleware to read cookies


// --------------------- AUTH MIDDLEWARE ---------------------
// const auth = (req, res, next) => {
//   try {
//     const { token } = req.cookies;
//     if (!token) {
//       return res.status(401).send("No token, please log in");
//     }

//     const decoded = jwt.verify(token, "DEV@Tinder$7900");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).send("Invalid or expired token");
//   }
// };

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

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // validatePassword should be a method in your User schema
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      
      const token = await user.getJWT();

     
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000), 
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
app.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;
    // if (!token) {
    //   throw new Error("Invalid token ");
    // }
    const decodeMessage = await user.validatePassword(password) ; //compare actual pass and hashed pass
    console.log(decodeMessage);
    const { _id } = decodeMessage;
    console.log("logged in user. :" + _id);
    const user = req.user;
    // if (!token) {
    //   throw new Error("Invalid user ");
    // }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
 
// --------------------- send Connection Request ---------------------
app.post("/sendConnectionRequest" , userAuth, async(req,res) => {
  const user = req.user;
  res.send(user.firstName + " send the request")
    //sending req
    console.log("Connection request sent");
    res.send("Connection request sent")
})


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
