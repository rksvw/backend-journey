const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL is connected");
  } catch (err) {
    console.log("PostgreSQL connection failed ", err.message);
    process.exit(1);
  }
};

connectDB();

module.exports = { pool };
