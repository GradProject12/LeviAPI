CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    chat_id INTEGER NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (chat_id)
);

INSERT INTO messages (message_id, body, chat_id) VALUES (11,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (12,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (13,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (14,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (15,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (16,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (17,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (18,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (20,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (21,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (22,'asdasd',1);