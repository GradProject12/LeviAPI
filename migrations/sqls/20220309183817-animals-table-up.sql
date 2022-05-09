CREATE TABLE animals (
    animal_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    picture VARCHAR,
    sound VARCHAR,
    spelled VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);