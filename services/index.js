const pool = require("../db.js");
const findUser = async (email) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return user;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async (email) => {
    try {
        const message = await pool.query("DELETE FROM users WHERE email = $1", [email]);
        console.log("logged from the delete function");
        return message;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const addOAuthUser = async (username, email) => {
    try {
        const newUser = await pool.query(
            "INSERT INTO users( username, email,avatar, is_oauth_user) VALUES($1, $2, true) RETURNING *",
            [username, email]
        );
        if (newUser.rows[0]) return newUser.rows[0];
    } catch (error) {
        throw error;
    }
};
const addOAuthUserGoogle = async (username, email, picture) => {
    try {
        const newUser = await pool.query(
            "INSERT INTO users( username, email,avatar, is_oauth_user) VALUES($1, $2,$3, true) RETURNING *",
            [username, email, picture]
        );
        if (newUser.rows[0]) return newUser.rows[0];
    } catch (error) {
        throw error;
    }
};

const findUserById = async (id) => {
    try {
        const result = await pool.query(
            "SELECT id, email, username, avatar FROM users WHERE id = $1",
            [id]
        );
        if (result.rows.length > 0) {
            return result.rows[0]; // Return the found user
        } else {
            return null; // No user found with this ID
        }
    } catch (error) {
        console.error("Error in findUserById:", error);
        throw error; // Rethrow the error or handle it as appropriate
    }
};

const findUserByEmail = async (email) => {
    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length > 0) {
            return userResult.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

const signUp = async (username, email, hashedPassword) => {
    try {
        const signUp = await pool.query(
            `INSERT INTO users (username, email, password_hash) VALUES($1, $2, $3) RETURNING *`,
            [username, email, hashedPassword]
        );
        if (signUp.rows[0]) return signUp.rows[0];
    } catch (err) {
        throw err;
    }
};
module.exports = {
    findUser,
    addOAuthUser,
    addOAuthUserGoogle,
    findUserById,
    signUp,
    findUserByEmail,
    deleteUser,
};
