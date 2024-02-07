const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"]; // 'jwt' is the name of your cookie
    }
    return token;
};
const headerExtractor = function (req) {
    let token = null;
    if (req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }
    return token;
};

module.exports = { cookieExtractor, headerExtractor };
