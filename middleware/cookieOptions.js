require("dotenv").config();

const prodCookieOptions = {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "dev" ? false : true,
    sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "none",
    maxAge: 7 * 86400 * 1000, // 7 days
};
const devCookieOptions = {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "dev" ? false : true,
    sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "none",
    maxAge: 7 * 86400 * 1000, // 7 days
    domain: ".planleggjula.no",
};

function getCookieOptions() {
    if (process.env.ENVIRONMENT === "dev") devCookieOptions;
    return prodCookieOptions;
}

module.exports = getCookieOptions;
