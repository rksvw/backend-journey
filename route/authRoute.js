const { express } = require("../app");
const { signup, login } = require("../controller/authController");
const route = express.Router();

module.exports = route.post("/signup", signup);
module.exports = route.post("/login", login);
