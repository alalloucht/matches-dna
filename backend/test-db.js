const pool = require("./db");

async function testDatabase() {
  try {
    const [rows] = await pool.query("SELECT * FROM result LIMIT 5");

    console.log("MySQL connection successful!");
    console.log(rows);

  } catch (error) {
    console.error("MySQL connection failed:");
    console.error(error.message);

  } finally {
    await pool.end();
  }
}

testDatabase();