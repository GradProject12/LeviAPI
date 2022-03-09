CREATE TABLE users (
    user_id  SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE  NOT NULL,
    email VARCHAR(40) UNIQUE  NOT NULL,
    password VARCHAR NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP 

);