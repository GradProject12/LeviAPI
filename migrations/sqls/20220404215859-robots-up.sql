CREATE TABLE robots (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER NOT NULL,
    doctor_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents (id),
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
);