const dotenv = require("dotenv");
const pg = require("pg");

dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  NODE_ENV
} = process.env;

const devConfig = {
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  port: POSTGRES_PORT,
  password: POSTGRES_PASSWORD,
};

const prodConfig={
  connectionString:process.env.DATABASE_URL,
}
const client = new pg.Pool(NODE_ENV==='production'?prodConfig:devConfig);

module.exports = client;
