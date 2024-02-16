const router = require("express").Router();
const passport = require("passport");
const pool = require("../../../db");
const ribbe = require("../predefined-meals/ribbe");
const lutefisk = require("../predefined-meals/lutefisk");
require("dotenv").config();

router.post("/ingredients", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const filteredData = Object.entries(req.body).reduce((acc, [key, value]) => {
        if (value != null && value !== "") {
            acc[key] = value;
        }
        return acc;
    }, {});

    const columns = Object.keys(filteredData).join(", ");
    const values = Object.values(filteredData);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO Ingredients (${columns}) VALUES (${placeholders}) RETURNING *`;

    try {
        const ingredient = await pool.query(query, values);
        res.sendData(ingredient.rows[0]);
    } catch (error) {
        console.log(error);
        res.sendError(error);
    }
});
router.post(
    "/ingredients/premade",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { meal, mealId, guestCount } = req.body;
        const premadeMeal = meal === "Ribbe" ? ribbe : lutefisk;
        const returnObject = { meal: null, ingredients: [] };

        try {
            for (const ingredient of premadeMeal) {
                ingredient.meal_id = mealId;
                const columns = Object.keys(ingredient).join(", ");
                const placeholders = Object.keys(ingredient)
                    .map((_, i) => `$${i + 1}`)
                    .join(", ");
                const values = Object.values(ingredient);
                const query = `INSERT INTO Ingredients (${columns}) VALUES (${placeholders}) RETURNING *`;
                const { rows } = await pool.query(query, values);
                returnObject.ingredients.push(rows[0]);
            }
        } catch (error) {
            console.error("Error inserting ingredients:", error);
            res.status(500).json({ error: "Failed to insert ingredients" });
            return;
        }
        try {
            const updateQuery = "UPDATE Meals SET guests = $1 WHERE id = $2 RETURNING *";
            const values = [Number(guestCount), Number(mealId)];
            const result = await pool.query(updateQuery, values);
            if (result.rows.length > 0) {
                returnObject.meal = result.rows[0];
                res.sendData(returnObject);
            } else {
                console.log("Meal not found or no changes made");
                res.status(404).json({ error: "Meal not found or no changes made" });
            }
        } catch (error) {
            console.log(error);
        }
    }
);

router.patch("/ingredients", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.body; // Assuming you send the id of the ingredient to be updated

    const query = "UPDATE Ingredients SET purchased = NOT purchased WHERE id = $1 RETURNING *";

    try {
        const updatedIngredient = await pool.query(query, [id]);
        res.send(updatedIngredient.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.delete(
    "/ingredients",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { mealId } = req.body;
        const query = "DELETE FROM Ingredients WHERE meal_id = $1 ";
        try {
            await pool.query(query, [mealId]);
            res.status(200);
        } catch (error) {
            console.error(error);
        }
    }
);

router.get("/ingredients", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const userId = req.user.id;
    const ingredients = await pool.query(
        "SELECT Ingredients.* FROM Ingredients JOIN Meals ON Ingredients.meal_id = Meals.id JOIN Users ON Meals.user_id = Users.id WHERE Users.id = $1;",
        [userId]
    );
    try {
        const ingredients = await pool.query(
            "SELECT Ingredients.* FROM Ingredients JOIN Meals ON Ingredients.meal_id = Meals.id JOIN Users ON Meals.user_id = Users.id WHERE Users.id = $1;",
            [userId]
        );
        res.sendData(ingredients.rows);
    } catch (error) {}
});

module.exports = router;
