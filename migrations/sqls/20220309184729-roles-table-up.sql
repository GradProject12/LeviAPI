CREATE TABLE roles(
   role_id serial PRIMARY KEY,
   role_name VARCHAR (255) UNIQUE NOT NULL
);

INSERT INTO roles(role_name) VALUES('admin'), ('user');