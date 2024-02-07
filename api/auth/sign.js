const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signUp, findUserByEmail } = require("../../services");
require("dotenv").config();

router.post("/sign", async (req, res) => {
    const { username, email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user && !username) {
        res.status(401).json({ data: null, error: "Wrong credentials" });
        return;
    } else if (!username && user) {
        const correctPassword = user && bcrypt.compareSync(password, user.password_hash);
        !correctPassword && res.status(401).json({ data: null, error: "Wrong credentials" });
        const token = jwt.sign({ sub: user.id }, process.env.COOKIE_KEY, {
            expiresIn: "100h",
        });
        process.env.ENVIRONMENT === "dev" && console.log("is dev mode");
        correctPassword &&
            res
                .status(200)
                .cookie("jwt", token, {
                    httpOnly: true, // Prevents client-side JS from reading the cookie
                    secure: process.env.ENVIRONMENT === "dev" ? false : true, // Ensures the cookie is sent over HTTPS
                    sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "strict", // Mitigates CSRF attacks
                    maxAge: 36000000,
                })
                .sendData({ name: user.username, token });
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        try {
            const user = await signUp(username, email, hashedPassword);
            const token = jwt.sign({ sub: user.id }, process.env.COOKIE_KEY, {
                expiresIn: "100h",
            });
            res.status(201)
                .cookie("jwt", token, {
                    httpOnly: true, // Prevents client-side JS from reading the cookie
                    secure: process.env.ENVIRONMENT === "dev" ? false : true, // Ensures the cookie is sent over HTTPS
                    sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "strict", // Mitigates CSRF attacks
                    maxAge: 36000000,
                })
                .sendData({ name: user.username, token });
        } catch (err) {
            res.sendError(err);
        }
    }
});

module.exports = router;
