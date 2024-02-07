const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// /api/auth/google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);
// /api/auth/google/redirect
router.get("/google/redirect", passport.authenticate("google", { session: false }), (req, res) => {
    if (req.user) {
        const token = jwt.sign(
            {
                sub: req.user.id,
            },
            process.env.COOKIE_KEY,
            { expiresIn: "7d" }
        );
        res.cookie("jwt", token, {
            httpOnly: true, // Prevents client-side JS from reading the cookie
            secure: process.env.ENVIRONMENT === "dev" ? false : true, // Ensures the cookie is sent over HTTPS
            sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "none", // Adjust for local testing
            maxAge: 7 * 86400 * 1000,
        }).redirect(process.env.FRONTEND_URL + "?signed=true");
    } else {
        res.redirect(process.env.FRONTEND_URL + "/login-failed");
    }
});

module.exports = router;
