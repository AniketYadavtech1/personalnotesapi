// require("dotenv").config();

// const { Pool } = require("pg");

// // PostgreSQL Local Database Connection
// const pool = new Pool({
//     host: process.env.DB_HOST || "localhost",
//     port: Number(process.env.DB_PORT) || 5432,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,

//     // SSL disabled for local PostgreSQL
//     ssl: false,

//     max: 10,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 5000
// });

// // Check database connection
// pool.connect()
//     .then((client) => {
//         console.log("PostgreSQL Database Connected Successfully");
//         client.release();
//     })
//     .catch((error) => {
//         console.error("PostgreSQL Database Connection Failed:");
//         console.error(error.message);
//     });

// // Handle unexpected database errors
// pool.on("error", (error) => {
//     console.error("Unexpected PostgreSQL Error:", error.message);
// });

// module.exports = pool;


const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

module.exports = pool;