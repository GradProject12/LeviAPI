CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(200) CHECK (type IN ('post','message')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);