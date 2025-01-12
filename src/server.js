const express  = require('express');
const app = express();

app.use(express.static("static"));

app.get("/", (req, res) => {
  console.log("Request received");
  res.status(200);
  res.json({ message: "Hello!" });
});

module.exports = app;