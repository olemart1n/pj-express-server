const passport = require("passport");
const LocalStrategy = require("passport-local");
const pool = require("../db.js");
require("dotenv").config();
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email", // Make sure to set the usernameField to 'email' if you are using email to log in
            passwordField: "password",
        },
        function (email, password, done) {
            pool.query("SELECT * FROM users WHERE email = $1", [email], function (err, result) {
                if (err) {
                    return done(err);
                }
                if (result.rows.length === 0) {
                    return done(null, false, { message: "Incorrect email or password." });
                }

                const user = result.rows[0];

                bcrypt.compare(password, user.password_hash, function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    if (res === false) {
                        return done(null, false, { message: "Incorrect email or password." });
                    } else {
                        return done(null, user);
                    }
                });
            });
        }
    )
);
