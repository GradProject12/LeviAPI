CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(100) UNIQUE,
    password VARCHAR NOT NULL,
    profile_image VARCHAR,
    certificate_image VARCHAR,
    clinic_location VARCHAR,
    clinic_phone_number VARCHAR,
    national_id VARCHAR,
    start_time TIME,
    end_time TIME,
    days_of_week VARCHAR[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);