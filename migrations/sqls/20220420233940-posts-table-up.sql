CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    file VARCHAR,
    image VARCHAR[],
    type VARCHAR(200) CHECK (type IN ('text_only','text_with_image','text_with_album','text_with_file')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES assets (asset_id)
);