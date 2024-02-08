const router = require("express").Router();
const passport = require("passport");
const pool = require("../../../db");
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
        res.sendStatus(200);
        try {
            const res = await pool.query(query, [mealId]);
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
