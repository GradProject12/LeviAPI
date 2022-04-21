CREATE TABLE robots (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER,
    doctor_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES parents (parent_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE
);

INSERT INTO robots (parent_id,doctor_id) VALUES (700,500);