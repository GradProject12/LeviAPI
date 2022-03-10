CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  grant_date TIMESTAMP DEFAULT Now(),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (role_id)
      REFERENCES roles (role_id) ON DELETE CASCADE, 
  FOREIGN KEY (user_id)
      REFERENCES users (user_id) ON DELETE CASCADE
);

INSERT INTO user_roles (user_id,role_id) VALUES(1,1);