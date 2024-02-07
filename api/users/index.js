const router = require("express").Router();
const passport = require("passport");
const pool = require("../../db");
const { deleteUser } = require("../../services");

router.get("/user", passport.authenticate("jwt", { session: false }), (req, res) => {
    try {
        res.sendData(req.user);
    } catch (error) {
        res.sendError(error);
    }
});

router.delete(
    "/user/delete",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        try {
            const message = await deleteUser(req.user.email);

            res.sendData(message);
        } catch (error) {
            console.log(error);
            res.sendError(error);
        }
    }
);

module.exports = router;
