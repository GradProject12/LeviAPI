CREATE TABLE robot_analysis (
    analysis_id SERIAL PRIMARY KEY,
    robot_id INTEGER NOT NULL,
    analysis json NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (robot_id) REFERENCES robots (robot_id) ON DELETE CASCADE
);