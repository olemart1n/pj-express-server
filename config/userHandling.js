const passport = require("passport");

const { findUserById } = require("../services/index.js");
passport.serializeUser((user, done) => {
    console.log("serializeUser is being called");
    done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
    console.log("deserializeUser is being called");
    try {
        const user = await findUserById(user_id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
