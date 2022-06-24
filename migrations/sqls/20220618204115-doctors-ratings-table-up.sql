CREATE TABLE doctors_ratings (
    rating_id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    parent_id INTEGER NOT NULL,
    rating DECIMAL NOT NULL ,
    review TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES parents (parent_id) ON DELETE CASCADE,
    CHECK (rating BETWEEN 0 AND 10),
    UNIQUE (doctor_id,parent_id)
);


INSERT INTO doctors_ratings (doctor_id,parent_id,rating,review) VALUES (500,700,4.5,'dfsasdasd');
INSERT INTO doctors_ratings (doctor_id,parent_id,rating,review) VALUES (501,700,4.5,'dfsasdasd');
INSERT INTO doctors_ratings (doctor_id,parent_id,rating,review) VALUES (502,701,4.5,'dfsasdasd');
INSERT INTO doctors_ratings (doctor_id,parent_id,rating,review) VALUES (503,703,4.5,'dfsasdasd');
INSERT INTO doctors_ratings (doctor_id,parent_id,rating,review) VALUES (503,702,4.5,'dfsasdasd');