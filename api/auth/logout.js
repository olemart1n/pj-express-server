const router = require("express").Router();
require("dotenv").config();
const { getCookieOptions } = require("../../middleware");
router.get("/logout", (req, res) => {
    res.cookie("jwt", "logged out", getCookieOptions).send("logged out");
});
module.exports = router;
