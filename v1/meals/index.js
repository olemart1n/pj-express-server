const router = require("express").Router();
const ingredients = require("./ingredients");
const passport = require("passport");
const pool = require("../../db");
require("dotenv").config();

router.use(ingredients);

router.get("/meal", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const userId = req.user.id;
    const name = req.query.name;
    const { rows } = await pool.query("SELECT * FROM Meals WHERE user_id=$1 AND name=$2", [
        userId,
        name,
    ]);
    try {
        if (rows.length > 0 && rows[0].ingredients_count > 0) {
            const ingredients = await pool.query(`SELECT * FROM Ingredients WHERE meal_id=$1`, [
                rows[0].id,
            ]);
            res.sendData({ meal: rows[0], ingredients: ingredients.rows });
        } else if (rows.length > 0) {
            res.sendData({ meal: rows[0], ingredients: [] });
        } else {
            const newMeal = await pool.query(
                "INSERT INTO Meals(user_id, name) VALUES($1, $2) RETURNING *",
                [userId, name]
            );

            res.sendData({ meal: newMeal.rows[0], ingredients: [] });
        }
    } catch (error) {
        console.error("Error executing query", error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
