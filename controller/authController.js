const { pool } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows.id, isAdmin: result.rows.isadmin },
      process.env.PRIVATE_KEY,
      { expiresIn: "7d" }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        samSite: "Strict",
      })
      .status(201)
      .json({ users: result.rows, token });
  } catch (err) {
    res.status(500).json({ msg: "Server Error 500" });
    throw new Error("Server Error:", err.message);
  }
}

async function login(req, res) {
  const { handle, password } = req.body;

  const query = [];
  const values = [];
  if (isValidEmail(handle)) {
    query.push("email");
  } else {
    query.push("username");
  }

  values.push(handle);

  if (password.length < 8) {
    return res.json({ msg: "Password has to be 8 character long" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE ${query[0]}=$1;`,
      values
    );

    const isCorrPass = await bcrypt.compare(password, result.rows[0].password);

    if (!isCorrPass) {
      return res.status(404).json({ error: "Incorrect password" });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, isAdmin: result.rows[0].isadmin },
      process.env.PRIVATE_KEY,
      { expiresIn: "7d" }
    );

    res
      .cookie("access_token", token, {
        httpOnly: true,
        samSite: "Strict",
      })
      .status(201)
      .json({
        users: result.rows[0],
        token,
      });
  } catch (err) {
    res.status(500).json({ msg: "Server Error 500" });
    throw new Error("Server Error:", err.message);
  }
}

module.exports = {
  signup,
  login,
};
