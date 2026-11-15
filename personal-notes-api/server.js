
// // require("dotenv").config();

// // const express = require("express");
// // const cors = require("cors");
// // const pool = require("./config/db");

// // const authRoutes = require("./routes/authRoutes");
// // const noteRoutes = require("./routes/noteRoutes");

// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // Root API
// // app.get("/", (req, res) => {
// //     res.json({
// //         success: true,
// //         message: "Personal Notes API is running"
// //     });
// // });

// // // Database health check
// // app.get("/health", async (req, res) => {
// //     try {
// //         await pool.query("SELECT 1");

// //         res.status(200).json({
// //             success: true,
// //             message: "Server and database are working"
// //         });
// //     } catch (error) {
// //         console.error("Health Check Error:", error.message);

// //         res.status(500).json({
// //             success: false,
// //             message: "Database connection failed"
// //         });
// //     }
// // });

// // // Auth APIs
// // app.use("/api/auth", authRoutes);

// // // Notes APIs
// // app.use("/api/notes", noteRoutes);

// // // Validate JWT
// // if (!process.env.JWT_SECRET) {
// //     throw new Error("JWT_SECRET is missing in .env");
// // }

// // // Start server
// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //     console.log(`Server running on port ${PORT}`);
// // });




// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const pool = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const noteRoutes = require("./routes/noteRoutes");

// const app = express();

// // Validate environment variables
// if (!process.env.JWT_SECRET) {
//     throw new Error("JWT_SECRET is missing");
// }

// if (!process.env.DATABASE_URL) {
//     throw new Error("DATABASE_URL is missing");
// }

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Root API
// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Personal Notes API is running"
//     });
// });

// // Database health check
// app.get("/health", async (req, res) => {
//     try {
//         await pool.query("SELECT 1");

//         res.status(200).json({
//             success: true,
//             message: "Server and database are working"
//         });

//     } catch (error) {
//         console.error("Health Check Error:", error.message);

//         res.status(500).json({
//             success: false,
//             message: "Database connection failed"
//         });
//     }
// });

// // Auth APIs
// app.use("/api/auth", authRoutes);

// // Notes APIs
// app.use("/api/notes", noteRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//     console.log(`Server running on port ${PORT}`);
// });




require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Validate environment variables before connecting to DB
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Personal Notes API is running"
    });
});

// Database health check
app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            success: true,
            message: "Server and database are working"
        });
    } catch (error) {
        console.error("Health Check Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Auth APIs
app.use("/api/auth", authRoutes);

// Notes APIs
app.use("/api/notes", noteRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
