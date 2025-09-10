const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());


app.post("/signup",async (req,res) => {
  console.log(req.body);
  // creating a new instance of the user model
  const user = new User(req.body);
try{
   await user.save();
 res.send("User adding successfully")
} catch(err){
  res.status(400).send("error saving");
}
});

//get user by email
app.get("/user" , async(req,res) => {
  const userEmail = req.body.emailId;
  try{
    const users = await User.find({emailId : userEmail})
    if(users.length === 0){
      return res.status(404).send("user not found");
    }else{
      res.send(users); 
    }
  }catch(err){
    res.send(400).send("something went wrong");
  }
})

//to delete user
app.delete("/user" , async(req,res) => {
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete({_id:userId});
    res.send("User deleted");
  }catch(err){
    res.status(400).send("spmenthing went wrong");
  }
})

// update user
app.patch("/user" , async(req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try{
    await User.findByIdAndUpdate(userId ,data);
    res.send("user updated")
  }catch(err){
    res.status(400).send("something went wrong");
  }
})

connectDB()
  .then(() => {
    console.log("Data connection established");
    app.listen(7777, () => {
    console.log("Serever is running on port 7777");
});
  })
  .catch((err) => {
    console.error("Data base connection failed");
  });

