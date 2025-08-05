const { express } = require("../app");
const {
  addCharacter,
  updateCharacterById,
  removeCharacterById,
} = require("../controller/postController");
const route = express.Router();

module.exports = route.post("/new-character", addCharacter);
module.exports = route.put("/update/:id", updateCharacterById);
module.exports = route.delete("/remove/:id", removeCharacterById);
