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

const devConfig = {
  connectionString: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
};

const prodConfig = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const client = new pg.Pool(NODE_ENV === "production" ? prodConfig : devConfig);

module.exports = client;
