const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

// --------------------- PROFILE ROUTE ---------------------
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // set by userAuth middleware
    res.send(user); // return the authenticated user
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

module.exports = profileRouter;