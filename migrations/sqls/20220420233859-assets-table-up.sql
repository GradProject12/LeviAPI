CREATE TABLE assets (
    asset_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(200) NOT NULL CHECK (type IN ('post','message')) ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO assets (asset_id,user_id,type) VALUES (111,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (112,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (113,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (114,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (115,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (116,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (117,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (118,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (119,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (1110,700,'post');
INSERT INTO assets (asset_id,user_id,type) VALUES (1111,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1112,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1113,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1114,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1115,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1116,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1117,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1118,700,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1120,800,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1121,800,'message');
INSERT INTO assets (asset_id,user_id,type) VALUES (1122,800,'message');