const router = require("express").Router();
const auth = require("./auth");
const users = require("./users");
const meals = require("./meals");
const test = require("./test");
require("dotenv").config();

router.use("/auth", auth);
router.use("/users", users);
router.use("/meals", meals);
router.use(test);
module.exports = router;
