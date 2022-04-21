CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(100) UNIQUE,
    password VARCHAR NOT NULL,
    profile_image VARCHAR,
    role VARCHAR(200) NOT NULL CHECK (role IN ('doctor','parent')),
    secret VARCHAR,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (user_id,full_name, email, password, role,verified) VALUES (1,'mohab','mu@gmail.com','$2a$10$u21P4ebMPl/IX6S/tPcMi.YVw3sBa0VVSvvWGIrPgk4Yj2N0J9n/e','doctor',false) ,
(2,'mohab','muu@gmail.com','$2a$10$u21P4ebMPl/IX6S/tPcMi.YVw3sBa0VVSvvWGIrPgk4Yj2N0J9n/e','parent',false);
