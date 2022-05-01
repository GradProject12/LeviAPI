CREATE TABLE parents (
    parent_id SERIAL PRIMARY KEY,
    doctor_id INTEGER,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES users (user_id) ON DELETE CASCADE

);

INSERT INTO parents (parent_id) VALUES (700);