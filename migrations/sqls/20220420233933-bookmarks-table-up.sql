CREATE TABLE bookmarks (
    bookmark_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (asset_id) REFERENCES assets (asset_id),
    UNIQUE (user_id,asset_id)
);


INSERT INTO bookmarks (user_id,asset_id) VALUES (700,1);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,2);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,3);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,4);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,5);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,6);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,7);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,8);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,9);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,10);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,11);   //messages
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,12);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,13);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,14);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,20);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,21);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,22);