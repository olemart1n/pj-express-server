const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const getCookieOptions = require("../../middleware/cookieOptions");
require("dotenv").config();

// /v1/auth/google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);
// /v1/auth/google/redirect
router.get("/google/redirect", passport.authenticate("google", { session: false }), (req, res) => {
    if (req.user) {
        const token = jwt.sign(
            {
                sub: req.user.id,
            },
            process.env.COOKIE_KEY,
            { expiresIn: "7d" }
        );
        res.cookie("jwt", token, getCookieOptions()).redirect(
            process.env.FRONTEND_URL + "?signed=true"
        );
    } else {
        res.redirect(process.env.FRONTEND_URL + "/login-failed");
    }
});

module.exports = router;
