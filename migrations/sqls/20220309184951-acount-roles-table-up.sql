CREATE TABLE account_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  grant_date TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (role_id)
      REFERENCES roles (role_id) ON DELETE CASCADE, 
  FOREIGN KEY (user_id)
      REFERENCES users (user_id) ON DELETE CASCADE
);