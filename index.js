const { app } = require("./app");
const authRoute = require("./route/authRoute");
const PORT = process.env.PORT;
const getRoute = require("./route/getRoute");
const postRoute = require("./route/postRoute");

app.use("/api", getRoute);
app.use("/api", postRoute);
app.use("/auth", authRoute);

app.get("/", async (req, res) => {
  console.log("Home");
  res.status(200).json({ msg: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
