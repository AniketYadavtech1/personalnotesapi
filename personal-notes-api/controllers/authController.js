const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        if (!cleanName) {
            return res.status(400).json({
                success: false,
                message: "Name cannot be empty"
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [cleanName, cleanEmail, hashedPassword]
        );
        const user = result.rows[0];
        const token = generateToken(user.id);
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user
        });

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

      
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

       
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

     
        const token = generateToken(user.id);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    signup,
    login,
    getProfile
};
