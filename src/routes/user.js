const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "istName lastName PhototURL age gender about skills";

//--------------------- API to get total requests received ---------------------
// get all the pending req for the logged in user
userRouter.get("/user/requests/recived", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //  }).populate("fromUserId" , ["firstName" , "lastName"])
  } catch (err) {
    req.status(400).send("ERROR " + err.message);
  }
});

//--------------------- API to get total accepted request ---------------------
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUset._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
        if(row.fromuserId._Id.toString() ===loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId;
    });
    res.json({data})
  } catch (err) {
    res.status(404).send("ERROR " + err.message);
  }
});

module.exports = userRouter;

