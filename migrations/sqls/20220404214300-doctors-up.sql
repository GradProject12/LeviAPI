DO $$ BEGIN
    CREATE TYPE work AS (
    start_time TIME,
    end_time TIME,
    day VARCHAR
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
    working_schedule work[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO doctors (doctor_id,national_id,working_schedule) VALUES (500,1321232112,ARRAY[('05:50','05:50','sun')::work,('05:50','05:50','sun')::work]);