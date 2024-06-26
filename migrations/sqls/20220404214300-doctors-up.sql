CREATE TABLE doctors (
    doctor_id SERIAL PRIMARY KEY,
    certificate_image VARCHAR,
    clinic_location VARCHAR,
    clinic_phone_number VARCHAR,
    national_id bigint NOT NULL,
    working_schedule json,
    accepted_status BOOLEAN DEFAULT FALSE NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO doctors (doctor_id,national_id,working_schedule,accepted_status) VALUES (500,1321232112,'{ "0": {"start": 10,"end": 20,"day":"sun"},"1": {"start": 10,"end": 20,"day":"sun"}}',true),
(501,1321232132,'{ "0": {"start": 10,"end": 20,"day":"sun"},"1": {"start": 10,"end": 20,"day":"sun"}}',true),
(502,1321232115,'{ "0": {"start": 10,"end": 20,"day":"sun"},"1": {"start": 10,"end": 20,"day":"sun"}}',true),
(503,1321232118,'{ "0": {"start": 10,"end": 20,"day":"sun"},"1": {"start": 10,"end": 20,"day":"sun"}}',true);