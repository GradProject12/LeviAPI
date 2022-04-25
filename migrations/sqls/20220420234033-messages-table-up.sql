CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    chat_id INTEGER NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (chat_id)
);

INSERT INTO messages (message_id, body, chat_id) VALUES (1111,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1112,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1113,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1114,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1115,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1116,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1117,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1118,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1120,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1121,'asdasd',1);
INSERT INTO messages (message_id, body, chat_id) VALUES (1122,'asdasd',1);