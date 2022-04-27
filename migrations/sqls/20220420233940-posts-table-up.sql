CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    file VARCHAR[],
    type VARCHAR(200) CHECK (type IN ('text_only','text_with_image','text_with_album','text_with_file')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES assets (asset_id)
);

INSERT INTO posts (post_id,body) VALUES (111,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (112,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (113,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (114,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (115,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (116,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (117,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (118,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (119,'asdasfwq');