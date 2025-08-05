const { app } = require("./app");
const { pool } = require("./db");
const PORT = process.env.PORT;
const getRoute = require("./route/getRoute");
const postRoute = require("./route/postRoute");

app.use("/api", getRoute);
app.use("/api", postRoute);

app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
