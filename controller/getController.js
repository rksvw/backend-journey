const { pool } = require("../db");

async function characterList(req, res) {
  try {
    const query = await pool.query("SELECT * FROM characters");
    const payload = query.rows;
    res.json(payload);
  } catch (err) {
    res.json({ msg: "Server Error" });
    throw new Error("Server Error", err.message);
  }
}

module.exports = {
  characterList,
};
