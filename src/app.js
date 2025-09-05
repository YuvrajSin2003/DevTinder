const express = require('express');

const app = express();

app.use("/help" , (req,res) => {
    res.send("help me");
});
app.use("/" , (req,res) => {
    res.send("Hello i am the fucking root");
});
app.use("/test" , (req,res) => {
    res.send("server is testing");
});
app.listen(3000 , () => {
    console.log("server is sccessfull listing on port 3000");
})