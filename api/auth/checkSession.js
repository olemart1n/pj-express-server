const router = require("express").Router();
require("dotenv").config();

router.get("/check", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
        res.status(200).json({ isAuthenticated: false });
    }
});
