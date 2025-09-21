const express = require('express');;
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");


// --------------------- send Connection Request ---------------------
requestRouter.post("/sendConnectionRequest" , userAuth, async(req,res) => {
  const user = req.user;
  res.send(user.firstName + " send the request")
    //sending req
    console.log("Connection request sent");
    res.send("Connection request sent")
})

module.exports = requestRouter;