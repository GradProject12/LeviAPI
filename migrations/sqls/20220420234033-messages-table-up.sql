CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    chat_id INTEGER NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (chat_id)
);