const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { cookieExtractor, headerExtractor } = require("./jwtExtractor");
const { findUserById } = require("../services");

passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, headerExtractor]),

            secretOrKey: process.env.COOKIE_KEY,
        },
        async (jwtPayload, done) => {
            try {
                const user = await findUserById(jwtPayload.sub);
                // console.log("user -> " + JSON.stringify(user));
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
