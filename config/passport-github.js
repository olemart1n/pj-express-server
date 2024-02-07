const passport = require("passport");
const GitHubStrategy = require("passport-github2");
const pool = require("../db.js");
const { findUser, addOAuthUser, findUserById } = require("../services");
require("dotenv").config();

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/api/auth/github/redirect",
        },
        async (accessToken, refreshToken, profile, done) => {
            // passport callback function
            const { displayName } = profile;
            const req = await fetch("https://api.github.com/user/emails", {
                headers: {
                    Authorization: "token " + accessToken,
                },
            });
            const res = await req.json();
            const { email } = res.find((email) => email.primary && email.verified);

            try {
                const user = await findUser(email);
                if (user.rows.length === 0) {
                    const newUser = await addOAuthUser(displayName, email);
                    done(null, newUser); // Proceed with the new user
                } else done(null, user.rows[0]); // Proceed with the existing user
            } catch (error) {
                console.log(error);
            }
        }
    )
);
