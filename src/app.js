const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving user: " + err.message);
  }
});


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
  const userId = req.body?.userId;
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

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
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
    res.status(400).send("Something went wrong");
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
