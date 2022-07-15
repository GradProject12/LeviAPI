CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (chat_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO messages (message_id, body, chat_id,user_id) VALUES (1111,'chat@1',9991,500)
,(1112,'chat@1',9991,500)
,(1113,'chat@1',9991,500)
,(1114,'chat@1',9991,700)
,(1115,'chat@1',9991,700)
,(1116,'chat@1',9991,700)
,(1117,'chat2',9992,701)
,(1118,'chat2',9992,502)
,(1120,'chat2',9992,701)
,(1121,'chat2',9992,502)
,(1122,'chat@1',9991,700);