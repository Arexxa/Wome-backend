const mysql = require('mysql2/promise'); // Use 'mysql2' for better compatibility and support
require('dotenv').config(); // Load environment variables from .env file

// Establish connection to the database
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT || 3306, // Use the port from env or default to 3306
// });

// // Establish connection to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.stack);
//     return;
//   }
//   console.log('Connected to MySQL database as ID', connection.threadId);
// });

// module.exports = connection;

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306, // Use the port from env or default to 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});

// Function to handle database queries with retry logic
async function queryDatabase(sql, params) {
  let retries = 5;
  while (retries) {
    try {
      const [rows, fields] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      console.error('Database query error:', err);
      if (retries === 1) throw err;
      retries -= 1;
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(res => setTimeout(res, 2000)); // Wait for 2 seconds before retrying
    }
  }
}

// Reconnect on disconnection
pool.on('connection', (connection) => {
  console.log('New database connection established');
  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      console.error('Database connection lost. Reconnecting...');
      pool.getConnection();
    } else {
      console.error('Unexpected database error:', err);
    }
  });
});

module.exports = { queryDatabase, pool };
