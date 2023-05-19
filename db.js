const Pool = require("pg").Pool;

// Railway.app
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: "containers-us-west-48.railway.app",
  port: 7138,
  user: "postgres",
  password: "9lkEJz7cDNlhQwYfNKpM",
  database: "railway",
  ssl: false,
});

module.exports = pool;

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Connected to the database");
  }
});
