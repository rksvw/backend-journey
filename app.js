const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
require("./db");
// app.use(cors({ optionsSuccessStatus: 200 }));

// Without this you cannot retrieve the user data
app.use(express.json());

module.exports = {
  express,
  app,
};
