const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

// get all the pending req for the logged in user
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName lastName"]);
    //  }).populate("fromUserId" , ["firstName" , "lastName"])
  } catch (err) {
    req.status(400).send("ERROR " + err.message);
  }
});

module.exports = userRouter;
