const express = require("express");
const app = express();

app.use(express.json());


function logged(req, res, next) {
  console.log("LOGGED");
  next()
}

const requestTime = function(req, res, next) {
  req.requestTime = Date.now()
  req.msgName = "Hello World"
  next()
}

app.use(requestTime)

app.get('/cat', (req, res) => {
  let responseText = 'Hello World!<br>'
  responseText += `<small>Requested at: ${new Date(req.requestTime).toDateString()}</small><br><h3>${req.msgName}</h3>`;
  res.send(responseText);
})

app.get("/", (req, res) => {
  res.send("HELLO");
});

app.listen(4000, () => {
  console.log("SErver is listening on port 4000");
});
