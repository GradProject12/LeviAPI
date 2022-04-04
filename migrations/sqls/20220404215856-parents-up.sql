CREATE TABLE parents (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(100) UNIQUE,
    password VARCHAR NOT NULL,
    image VARCHAR,
    doctor_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id)
      REFERENCES doctors (id)
);