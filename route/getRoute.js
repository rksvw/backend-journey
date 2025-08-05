const { express } = require("../app");
const { helloPage, characterList } = require("../controller/getController");
const route = express.Router();

module.exports = route.get("/characters", characterList);
