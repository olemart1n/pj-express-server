require("dotenv").config();

const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "dev" ? false : true,
    sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "none",
    maxAge: 7 * 86400 * 1000, // 7 days
};

function getCookieOptions() {
    const cookieOptions = { ...baseCookieOptions };

    if (process.env.ENVIRONMENT !== "dev") {
        cookieOptions.domain = ".planleggjula.no";
    }
    return cookieOptions;
}

module.exports = getCookieOptions;
