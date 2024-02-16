const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
require("dotenv").config();
const { findUser, addOAuthUserGoogle } = require("../services/index.js");

passport.use(
    new GoogleStrategy(
        {
            // google strategy options
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                process.env.ENVIRONMENT === "dev"
                    ? "http://localhost:3000/v1/auth/google/redirect"
                    : "https://api.planleggjula.no/v1/auth/google/redirect",
        },

        async (accessToken, refreshToken, profile, done) => {
            // passport callback function
            const { given_name, email, picture } = profile._json;
            try {
                const user = await findUser(email);
                console.log(user);
                if (user.rows.length === 0) {
                    const newUser = await addOAuthUserGoogle(given_name, email, picture);
                    done(null, newUser); // Proceed with the new user
                } else {
                    done(null, user.rows[0]);
                } // Proceed with the existing user
            } catch (error) {
                console.log(error);
            }
        }
    )
);
