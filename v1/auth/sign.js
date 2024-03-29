const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getCookieOptions = require("../../middleware/cookieOptions");
const { signUp, findUserByEmail } = require("../../services");
require("dotenv").config();

router.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (user.is_oauth_user) {
        res.status(401).json({ data: null, error: "Feil innloggings-metode" });
        return;
    } else if (!user) {
        res.status(401).json({ data: null, error: "Feil email eller passord" });
        return;
    } else {
        const correctPassword = user && bcrypt.compareSync(password, user.password_hash);
        !correctPassword && res.status(401).json({ data: null, error: "Feil email eller passord" });
        const token = jwt.sign({ sub: user.id }, process.env.COOKIE_KEY, {
            expiresIn: "100h",
        });
        process.env.ENVIRONMENT === "dev" && console.log("is dev mode");
        correctPassword &&
            res
                .status(200)
                .cookie("jwt", token, getCookieOptions())
                .sendData({ name: user.username, token });
    }
});
router.post("/sign-up", async (req, res) => {
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const user = await signUp(username, email, hashedPassword);
        const token = jwt.sign({ sub: user.id }, process.env.COOKIE_KEY, {
            expiresIn: "100h",
        });
        res.status(201)
            .cookie("jwt", token, getCookieOptions())
            .sendData({ name: user.username, token });
    } catch (err) {
        res.sendError(err);
    }
});

module.exports = router;
