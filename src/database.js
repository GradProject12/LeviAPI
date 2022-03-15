const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  DATABASE_URL,
  NODE_ENV,
  ENV
} = process.env;

const devConfig = {
  connectionString: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${ENV==='dev'?POSTGRES_DB:POSTGRES_DB_TEST}`,
};

const prodConfig = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const client = new pg.Pool(NODE_ENV === "production" ? prodConfig : devConfig);

module.exports = client;
