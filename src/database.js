const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  DATABASE_URL,
  NODE_ENV,
} = process.env;

const devConfig = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

const prodConfig = DATABASE_URL;

const client = new pg.Pool({
  connectionString: NODE_ENV === "production" ? prodConfig : devConfig,
});

module.exports = client;
