const { Pool } = require("pg");
const url = require("url");
require("dotenv").config();

let dbParams = {};
if (process.env.DATABASE_URL) {
    // If running on Heroku, use the Heroku database URL
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(":");

    dbParams = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split("/")[1],
        ssl: {
            rejectUnauthorized: false, // Important for Heroku Postgres connection
        },
    };
} else {
    // If running locally, use the values from .env file
    dbParams = {
        user: process.env.USERNAME,
        host: process.env.HOST,
        port: process.env.DB_PORT,
        database: process.env.DATABASE,
    };
}

const pool = new Pool(dbParams);

module.exports = pool;
