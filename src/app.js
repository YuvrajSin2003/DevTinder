const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const validateSignUpData = require("./utils/validation"); // fixed import
const bcrypt = require("bcrypt");

app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Create user with hashed password
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save(); // save user

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});

//Login route
app.post('/login', async (req , res) => {
  try{
    const {emailId , password} = req.body;
    
    const user = await User.findOne({ emailId: emailId });
    if(!user){
      throw new Error("Invalid credintials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid){ 

      //create a JWT Token
      // Add the token cookies and send the response back to the user





      res.send("login successful");
    }else{
      throw new Error("login failed: invalid password");
    }
  }catch(err){
    res.status(400).send("Login failed: " + err.message);
  }
})


// Delete user
app.delete("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Update user by ID
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

// Update using email
app.patch("/user/email", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  try {
    await User.findOneAndUpdate({ emailId: emailId }, data, {
      runValidators: true,
    });
    res.send("User updated");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// Connect DB and start server
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
