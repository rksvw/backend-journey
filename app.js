const express = require("express");
const cors = require("cors");
const app = express();

// app.use(cors({ optionsSuccessStatus: 200 }));

// Without this you cannot retrieve the user data
app.use(express.json());

require("dotenv").config();

module.exports = {
  express,
  app,
};
