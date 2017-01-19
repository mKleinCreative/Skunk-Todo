DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR DEFAULT NULL,
  password VARCHAR
);

DROP TABLE IF EXISTS "list";

CREATE TABLE "list" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER DEFAULT NULL,
  title VARCHAR DEFAULT NULL,
  complete BOOLEAN DEFAULT false
);


DROP TABLE IF EXISTS "todo";

CREATE TABLE "todo" (
  todo_id SERIAL PRIMARY KEY,
  list_id INTEGER DEFAULT NULL,
  description VARCHAR,
  complete BOOLEAN DEFAULT false
);

ALTER TABLE "list" ADD FOREIGN KEY (user_id) REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "todo" ADD FOREIGN KEY (list_id) REFERENCES "list" ("id") ON DELETE CASCADE;

 INSERT INTO "list" ( title ) VALUES
 ('stuff');
 INSERT INTO "todo" (list_id,description) VALUES
 ((SELECT id FROM "list" LIMIT 1),'do things');
