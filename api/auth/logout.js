const router = require("express").Router();
require("dotenv").config();
const getCookieOptions = require("../../middleware/cookieOptions");
router.get("/logout", (req, res) => {
    res.cookie("jwt", "logged out", getCookieOptions()).send("logged out");
});
module.exports = router;
