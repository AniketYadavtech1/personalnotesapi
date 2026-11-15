
const Note = require("../models/noteModel");

// CREATE NOTE

const createNote = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Note title is required"
            });
        }

        if (title.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 200 characters"
            });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const note = await Note.createNote(
            req.user.id,
            title.trim(),
            content || "",
            category || "General"
        );

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            note
        });

    } catch (error) {
        console.error("Create note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create note",
            error: error.message
        });
    }
};



// GET ALL NOTES
const getAllNotes = async (req, res) => {
    try {
        const {
            search,
            category,
            is_pinned,
            is_archived
        } = req.query;

        const parseBoolean = (value) => {
            if (value === undefined) return undefined;
            if (value === "true") return true;
            if (value === "false") return false;
            return null;
        };

        const pinned = parseBoolean(is_pinned);
        const archived = parseBoolean(is_archived);

        if (pinned === null || archived === null) {
            return res.status(400).json({
                success: false,
                message: "Boolean filters must be true or false"
            });
        }

        const notes = await Note.getAllNotes(
            req.user.id,
            {
                search,
                category,
                is_pinned: pinned,
                is_archived: archived
            }
        );

        return res.status(200).json({
            success: true,
            total: notes.length,
            notes
        });

    } catch (error) {
        console.error("Get notes error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notes"
        });
    }
};


// GET SINGLE NOTE
const getNoteById = async (req, res) => {
    try {
        const noteId = Number(req.params.id);

        if (!Number.isInteger(noteId) || noteId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID"
            });
        }

        const note = await Note.getNoteById(
            noteId,
            req.user.id
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            note
        });

    } catch (error) {
        console.error("Get note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch note"
        });
    }
};


// UPDATE NOTE
const updateNote = async (req, res) => {
    try {
        const noteId = Number(req.params.id);
        const { title, content, category } = req.body;

        if (!Number.isInteger(noteId) || noteId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID"
            });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Note title is required"
            });
        }

        if (title.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 200 characters"
            });
        }

        const note = await Note.updateNote(
            noteId,
            req.user.id,
            title.trim(),
            content || "",
            category || "General"
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note
        });

    } catch (error) {
        console.error("Update note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update note"
        });
    }
};


// DELETE NOTE
const deleteNote = async (req, res) => {
    try {
        const noteId = Number(req.params.id);

        if (!Number.isInteger(noteId) || noteId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID"
            });
        }

        const note = await Note.deleteNote(
            noteId,
            req.user.id
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });

    } catch (error) {
        console.error("Delete note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete note"
        });
    }
};


// PIN / UNPIN NOTE
const togglePin = async (req, res) => {
    try {
        const noteId = Number(req.params.id);
        const { is_pinned } = req.body;

        if (!Number.isInteger(noteId) || noteId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID"
            });
        }

        if (typeof is_pinned !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "is_pinned must be true or false"
            });
        }

        const note = await Note.togglePin(
            noteId,
            req.user.id,
            is_pinned
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: is_pinned
                ? "Note pinned successfully"
                : "Note unpinned successfully",
            note
        });

    } catch (error) {
        console.error("Pin note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update pin status"
        });
    }
};


// ARCHIVE / UNARCHIVE NOTE
const toggleArchive = async (req, res) => {
    try {
        const noteId = Number(req.params.id);
        const { is_archived } = req.body;

        if (!Number.isInteger(noteId) || noteId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID"
            });
        }

        if (typeof is_archived !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "is_archived must be true or false"
            });
        }

        const note = await Note.toggleArchive(
            noteId,
            req.user.id,
            is_archived
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: is_archived
                ? "Note archived successfully"
                : "Note unarchived successfully",
            note
        });

    } catch (error) {
        console.error("Archive note error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update archive status"
        });
    }
};


module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive
};
