const express = require("express");
const app = express();

app.use(express.json());

const testUrl = "http://localhost:3000/name";

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.listen(4000, () => {
  console.log("SErver is listening on port 4000");
});
