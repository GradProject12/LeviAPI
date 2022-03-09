const dotenv = require("dotenv");
const Pool = require("pool");

dotenv.config();
const host = POSTGRES_HOST;
const database = POSTGRES_DB;
const user = POSTGRES_USER;
const port = POSTGRES_PASSWORD;
const password = POSTGRES_PORT;

const client = new Pool({
  host: host,
  database: database,
  user: user,
  port: port,
  password: password,
});

module.exports = client;
