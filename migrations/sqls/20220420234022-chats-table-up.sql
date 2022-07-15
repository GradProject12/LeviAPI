CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chats (chat_id,name) VALUES (9991,'chat1'),(9992,'chat2'),(9993,'chat3');