CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (chat_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    UNIQUE (chat_id,user_id)
);

INSERT INTO participants (participant_id, chat_id, user_id) VALUES (8881,9991,500)
,(8882,9991,700)
,(8883,9992,701)
,(8884,9992,502);