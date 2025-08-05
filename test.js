const express = require("express");
const app = express();
const route = express.Router();

app.use(express.json());

function logged(req, res, next) {
  console.log("LOGGED");
  next();
}

const requestTime = function (req, res, next) {
  req.requestTime = Date.now();
  req.msgName = "Hello World";
  next();
};

app.use(requestTime);

function logOriginalUrl(req, res, next) {
  console.log("Request URL:", req.originalUrl);
  next();
}

function logMethod(req, res, next) {
  console.log("Request Type:", req.method);
  next();
}

const logStuff = [logOriginalUrl, logMethod];

route.post(
  "/user/:id",
  logStuff,
  (req, res, next) => {
    // if the user ID is 0, skip to the next route
    if (req.params.id === "0") next("route");
    // otherwise pass the control to the next middleware function in this stack
    else next();
  },
  (req, res, next) => {
    // send a regular response
    res.json({ msg: "successful to regular" });
  }
);

route.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something broke!" });
});

route.get("/user/:id", (req, res, next) => {
  console.log("Request Type", req.method);
  res.json({ msg: "successful to special" });
});

app.get("/cat", (req, res) => {
  let responseText = "Hello World!<br>";
  req.cookies = { msg: "hello" };

  console.log("Cookies", req.cookies);
  responseText += `<small>Requested at: ${new Date(
    req.requestTime
  ).toDateString()}</small><br><h3>${req.msgName}</h3>`;
  res.send(responseText);
});

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.listen(4000, () => {
  console.log("SErver is listening on port 4000");
});

app.use("/", route);
