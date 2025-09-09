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
 res.send("USer adding successfully")
} catch(err){
  res.status(400).send("error saving");
}
});



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

