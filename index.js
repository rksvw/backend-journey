const { app, express } = require("./app");
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  console.log("Hello world");
  res.send("<h1>Hello to me!</h1>");
});

app.post("/name", async (req, res) => {
    console.log(req.body)
  const { name } = req.body;
  res.status(200).json({ msg: `Hello ${name}` });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
