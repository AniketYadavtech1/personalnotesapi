
const pool = require("../config/db");


const createNote = async (userId, title, content, category) => {
    const result = await pool.query(
        `INSERT INTO notes
        (user_id, title, content, category)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [userId, title, content || "", category || "General"]
    );

    return result.rows[0];
};



const getAllNotes = async (userId, filters = {}) => {
    const {
        search,
        category,
        is_pinned,
        is_archived
    } = filters;

    let query = `SELECT * FROM notes WHERE user_id = $1`;
    const values = [userId];

    if (search) {
        values.push(`%${search}%`);
        query += ` AND (
            title ILIKE $${values.length}
            OR content ILIKE $${values.length}
        )`;
    }

    if (category) {
        values.push(category);
        query += ` AND category = $${values.length}`;
    }

    if (is_pinned !== undefined) {
        values.push(is_pinned);
        query += ` AND is_pinned = $${values.length}`;
    }

    if (is_archived !== undefined) {
        values.push(is_archived);
        query += ` AND is_archived = $${values.length}`;
    }

    query += ` ORDER BY is_pinned DESC, created_at DESC`;

    const result = await pool.query(query, values);

    return result.rows;
};



const getNoteById = async (noteId, userId) => {
    const result = await pool.query(
        `SELECT * FROM notes
         WHERE id = $1 AND user_id = $2`,
        [noteId, userId]
    );

    return result.rows[0];
};



const updateNote = async (
    noteId,
    userId,
    title,
    content,
    category
) => {
    const result = await pool.query(
        `UPDATE notes
         SET title = $1,
             content = $2,
             category = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [title, content, category, noteId, userId]
    );

    return result.rows[0];
};



const deleteNote = async (noteId, userId) => {
    const result = await pool.query(
        `DELETE FROM notes
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [noteId, userId]
    );

    return result.rows[0];
};



const togglePin = async (noteId, userId, isPinned) => {
    const result = await pool.query(
        `UPDATE notes
         SET is_pinned = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [isPinned, noteId, userId]
    );

    return result.rows[0];
};



const toggleArchive = async (noteId, userId, isArchived) => {
    const result = await pool.query(
        `UPDATE notes
         SET is_archived = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [isArchived, noteId, userId]
    );

    return result.rows[0];
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
