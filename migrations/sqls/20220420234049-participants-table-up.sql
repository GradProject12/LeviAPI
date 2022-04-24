CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (chat_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    UNIQUE (chat_id,user_id)
);