const express = require("express");

const app = express();

app.get("/getUserData" , (req,res) => {
  throw new ERRROR("XNCNC");
  res.send("User data");
});

app.use("/" , (err , req , res , next) => {
  if(err){
    res.send(500).send("Something went wrong");
  }
});

app.listen(7777 , () => {
  console.log("Serever is running on port 7777");
})