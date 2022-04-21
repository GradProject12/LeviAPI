CREATE TABLE parents (
    parent_id SERIAL PRIMARY KEY,
    doctor_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id),
    FOREIGN KEY (parent_id) REFERENCES users (user_id)

);

INSERT INTO parents (parent_id) VALUES (2);