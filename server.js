require("dotenv").config();

const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const bodyParser = require("body-parser");

const port = process.env.PORT || 8080;
const APP_VERSION = process.env.REACT_APP_VERSION;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

app.get("/api/info", function (req, res) {
  return res.send({
    latest_version: APP_VERSION,
  });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port);
