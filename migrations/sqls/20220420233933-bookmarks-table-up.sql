CREATE TABLE bookmarks (
    bookmark_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (asset_id) REFERENCES assets (asset_id) ON DELETE CASCADE,
    UNIQUE (user_id,asset_id)
);


INSERT INTO bookmarks (user_id,asset_id) VALUES (700,111);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,112);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,113);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,114);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,115);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,116);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,117);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,118);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,119);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,1110);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,1111);   
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,1112);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,1113);
INSERT INTO bookmarks (user_id,asset_id) VALUES (800,1114);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,1120);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,1121);
INSERT INTO bookmarks (user_id,asset_id) VALUES (700,1122);