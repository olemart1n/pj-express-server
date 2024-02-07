const express = require("express");
const api = require("./api");
require("dotenv").config();
require("./config/passport-google.js");
require("./config/passport-github.js");
require("./config/passport-local.js");
require("./config/passport-jwt.js");
require("./config/userHandling.js");

const passport = require("passport");
const sendResponse = require("./middleware/sendResponse.js");

const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

const developmentOrigins = [
    process.env.FRONTEND_URL,
    "http://172.20.10.2:5173",
    "http://169.254.86.106:5173",
];
const productionOrigin = process.env.FRONTEND_URL;
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.ENVIRONMENT === "dev" ? developmentOrigins : productionOrigin,
        credentials: true,
    })
);

// INITIALIZE PASSPORT
app.use(passport.initialize());

app.use(express.json());
app.use(sendResponse);
app.set("view engine, ejs");
app.use("/api", api);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
