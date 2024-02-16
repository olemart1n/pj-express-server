const router = require("express").Router();

require("dotenv").config();

router.get("/test", async (req, res) => {
    process.env.ENVIRONMENT === "dev" && console.log("is dev mode");
    console.log("hello there");
    const token = "Hello there";
    res.status(200)
        .cookie("test", token, {
            httpOnly: true, // Prevents client-side JS from reading the cookie
            secure: false, // Ensures the cookie is sent over HTTPS
            sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "strict", // Mitigates CSRF attacks
            maxAge: 36000000,
        })
        .sendData({ name: "user.username", token });
});

module.exports = router;
