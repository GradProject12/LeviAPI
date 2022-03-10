const dotenv = require("dotenv");
const pg = require('pg')

dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

const client = new pg.Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  port: POSTGRES_PORT,
  password: POSTGRES_PASSWORD,
});

module.exports = client;
