DO $$ BEGIN
    CREATE TYPE work AS (
    start_time TIME,
    end_time TIME,
    days_of_week VARCHAR
);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    certificate_image VARCHAR,
    clinic_location VARCHAR,
    clinic_phone_number VARCHAR,
    national_id VARCHAR(255) NOT NULL,
    wokring_schedule work[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO doctors (doctor_id,national_id) VALUES (500,1321232112);