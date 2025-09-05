const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send("Hello form the server");
});
app.delete("/user", (req, res) => {
  console.log("data is deleted");
  res.send("data is deleted");
});
app.post("/user", (req, res) => {
  console.log("data is saved");
  res.send("data is saved");
});
app.listen(3000, () => {
  app.use("/", (req, res) => {
    res.send("Hello i am the fucking root");
  });
  console.log("server is sccessfull listing on port 3000");
});
