const router = require("express").Router();
const google = require("./google");
const github = require("./github");
const localSign = require("./sign");
const logout = require("./logout");
const checkJwt = require("./checkjwt");
require("dotenv").config();

router.use(localSign);
router.use(google);
router.use(github);
router.use(logout);
router.use(checkJwt);

module.exports = router;
