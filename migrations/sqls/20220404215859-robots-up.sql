CREATE TABLE robots (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER,
    doctor_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents (parent_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id)
);

INSERT INTO robots (parent_id,doctor_id) VALUES (2,1);