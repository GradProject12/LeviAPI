CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(200) CHECK (type IN ('post','message')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

INSERT INTO assets (asset_id,user_id,type) VALUES (1,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (2,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (3,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (4,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (5,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (6,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (7,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (8,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (9,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (10,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (11,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (12,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (13,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (14,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (15,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (16,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (17,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (18,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (20,800,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (21,800,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (22,800,'message');