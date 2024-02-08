const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { getCookieOptions } = require("../../services");
require("dotenv").config();

// /api/auth/github
router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["profile", "user:email"],
    })
);
// /api/auth/github/redirect
router.get("/github/redirect", passport.authenticate("github", { session: false }), (req, res) => {
    if (req.user) {
        const token = jwt.sign(
            {
                sub: req.user.id, // Use the user's unique identifier
                // ... other claims as needed
            },
            process.env.COOKIE_KEY,
            { expiresIn: "7d" }
        );

        // Redirect with the token as a query parameter
        res.cookie("jwt", token, getCookieOptions).redirect(
            process.env.FRONTEND_URL + "?signed=true"
        );
    } else {
        res.redirect(process.env.FRONTEND_URL + "/login-failed");
    }
});

module.exports = router;
