const router = require("express").Router();
require("dotenv").config();
router.get("/logout", (req, res) => {
    res.cookie("jwt", "logged out", {
        httpOnly: true, // Prevents client-side JS from reading the cookie
        secure: process.env.ENVIRONMENT === "dev" ? false : true, // Ensures the cookie is sent over HTTPS
        sameSite: "None", // Mitigates CSRF attacks
        maxAge: 7 * 86400 * 1000,
    }).send("logged out");
});
module.exports = router;
