const router = require("express").Router();
const jwt = require("jsonwebtoken");
const pool = require("../../db");
require("dotenv").config();

router.get("/checkjwt", (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.COOKIE_KEY);

            res.json({
                isAuthenticated: true,
                token: decoded,
            });
        } catch (err) {
            res.json({ isAuthenticated: false });
        }
    } else {
        res.json({ isAuthenticated: false });
    }
});

module.exports = router;
