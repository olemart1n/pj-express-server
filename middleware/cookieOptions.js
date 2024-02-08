require("dotenv").config();

const prodCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 86400 * 1000,
    domain: ".planleggjula.no",
};
const devCookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 86400 * 1000,
};

const getCookieOptions = () => {
    return process.env.ENVIRONMENT === "dev" ? devCookieOptions : prodCookieOptions;
};

module.exports = getCookieOptions;
