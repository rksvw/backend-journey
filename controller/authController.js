const { pool } = require("../db");
const bcrypt = require("bcrypt");

const isValidEmail = (em) => {
  const regex = /^[a-zA-Z]{1,}[\d?\D]{1,}[@]{1}[a-z]{2,}.[com]{3}$/g;
  return regex.test(em);
};

async function signup(req, res) {
  const { username, firstname, lastname, email, password, gender } = req.body;
  const saltRounds = 10;

  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(403).json({ msg: "Please fill all required fields" });
  }

  const query = [
    "username",
    "fullname",
    "email",
    "password",
    "isAdmin",
    "gender",
  ];
  const values = [username];

  const fullname = firstname + " " + lastname;
  values.push(fullname);

  if (!isValidEmail(email)) {
    return res.status(403).json({ msg: "Please enter valid Email" });
  }

  values.push(email);

  const hashPass = await bcrypt.hash(password, saltRounds);
  values.push(hashPass);

  values.push(false);

  if (gender) {
    values.push(gender);
  } else {
    values.push("N");
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (${query.join(
        ", "
      )}) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      values
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(201).json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ msg: "Server Error 500" });
    throw new Error("Server Error:", err.message);
  }
}

module.exports = {
  signup,
};
