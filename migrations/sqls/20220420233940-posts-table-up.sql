CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    file VARCHAR,
    image VARCHAR[],
    type VARCHAR(200) CHECK (type IN ('text_only','text_with_image','text_with_album','text_with_file')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES assets (asset_id)
);

INSERT INTO posts (post_id,body) VALUES (1,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (2,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (3,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (4,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (5,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (6,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (7,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (8,'asdasfwq');
INSERT INTO posts (post_id,body) VALUES (9,'asdasfwq');