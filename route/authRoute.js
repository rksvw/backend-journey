const { express } = require("../app");
const { signup } = require("../controller/authController");
const route = express.Router();

module.exports = route.post("/signup", signup);
