const Pool = require("pg").Pool;
require("dotenv").config();
const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
});
module.exports = pool;
