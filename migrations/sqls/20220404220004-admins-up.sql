CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    role VARCHAR(200) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    create_at TIMESTAMP DEFAULT Now()
);

INSERT INTO admins (role,username,email,password) VALUES ('admin','admin','admin@levi.com','$2a$10$u21P4ebMPl/IX6S/tPcMi.YVw3sBa0VVSvvWGIrPgk4Yj2N0J9n/e')