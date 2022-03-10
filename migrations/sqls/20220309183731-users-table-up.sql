CREATE TABLE users (
    user_id  SERIAL PRIMARY KEY,
    username VARCHAR(40) UNIQUE  NOT NULL,
    email VARCHAR(40) UNIQUE  NOT NULL,
    password VARCHAR NOT NULL,
    created_on TIMESTAMP DEFAULT Now()  NOT NULL,
    last_login TIMESTAMP 
);

INSERT INTO users(username,
email,
password) VALUES('admin','admin@levi.com','$2a$10$d6Ch9XesJXbS6e7TTQr.B.TZ7.vIAwbabMpsTxXZfocD2fE13oAA.');