
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive
} = require("../controllers/noteController");

// All routes below require login
router.use(authMiddleware);

// Create note
router.post("/", createNote);

// Get all notes and search/filter
router.get("/", getAllNotes);

// Pin / unpin note
router.patch("/:id/pin", togglePin);

// Archive / unarchive note
router.patch("/:id/archive", toggleArchive);

// Get single note
router.get("/:id", getNoteById);

// Update note
router.put("/:id", updateNote);

// Delete note
router.delete("/:id", deleteNote);

module.exports = router;
