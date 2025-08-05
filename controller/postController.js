const { pool } = require("../db");

async function addCharacter(req, res) {
  try {
    const { name, homeland, favorite_color } = req.body;
    const query = await pool.query(
      "INSERT INTO characters (name, homeland, favorite_color) VALUES ($1, $2, $3) RETURNING *",
      [name, homeland, favorite_color]
    );

    if (!query) {
      res.json({ msg: "Query Error" });
    }

    const payload = query.rows;

    res.json(payload);
  } catch (err) {
    res.json({ msg: "Server Error" });
    throw new Error("Server Error", err.message);
  }
}

async function updateCharacterById(req, res) {
  const id = req.params.id;
  const { name, homeland, favorite_color } = req.body;

  const feilds = [];
  const values = [];
  let idx = 1;

  if (name !== undefined) {
    feilds.push(`name = $${idx++}`);
    values.push(name);
  }
  if (homeland !== undefined) {
    feilds.push(`homeland = $${idx++}`);
    values.push(homeland);
  }
  if (favorite_color !== undefined) {
    feilds.push(`favorite_color = $${idx++}`);
    values.push(favorite_color);
  }

  if (feilds.length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const query = `UPDATE characters SET ${feilds.join(
    ", "
  )} WHERE character_id = $${idx} RETURNING *`;

  values.push(id);
  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ updated: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    throw new Error("Server Error", err.message);
  }
}

async function removeCharacterById(req, res) {
  const id = req.params.id;
  const query = `DELETE FROM characters WHERE character_id = $1`;

  try {
    const result = await pool.query(query, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    throw new Error("Server Error", err.message);
  }
}

module.exports = {
  updateCharacterById,
  addCharacter,
  removeCharacterById,
};
