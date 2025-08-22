const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hdsdsdllo from the server");
});

app.use("/test", (req, res) => {
  res.send("tdsdest");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
