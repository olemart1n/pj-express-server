const express = require("express");
const api = require("./api");
require("dotenv").config();
require("./config/passport-google.js");
require("./config/passport-github.js");
require("./config/passport-local.js");
require("./config/passport-jwt.js");
require("./config/userHandling.js");

const passport = require("passport");
const { sendResponse } = require("./middleware");

const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
console.log("Environment:", process.env.ENVIRONMENT);
console.log("Frontend URL:", process.env.FRONTEND_URL);

const developmentOrigins = [
    process.env.FRONTEND_URL,
    "http://172.20.10.2:5173",
    "http://169.254.86.106:5173",
];
const productionOrigin = process.env.FRONTEND_URL;
app.use(cookieParser());
app.use(
    cors({
        origin: (origin, callback) => {
            const allowedOrigins =
                process.env.ENVIRONMENT === "dev" ? developmentOrigins : [productionOrigin];

            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// INITIALIZE PASSPORT
app.use(passport.initialize());

app.use(express.json());
app.use(sendResponse);
app.set("view engine, ejs");
app.use("/api", api);
// app.set("trust proxy", 1);
app.get("/", (req, res) => {
    res.send("server is up and running");
});
app.get("/test", (req, res) => {
    // console.log(req.body);
    console.log(process.env.ENVIRONMENT);

    res.cookie("jwt", "testing", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "dev" ? false : true,
        sameSite: process.env.ENVIRONMENT === "dev" ? "Lax" : "none", // Adjust for local testing
        maxAge: 7 * 86400 * 1000,
        domain: ".planleggjula.no",
    }).json({ message: "this is sent from the test route" });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
