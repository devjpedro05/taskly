PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(trim(name)) > 0),
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL CHECK(length(trim(name)) > 0),
  professor TEXT NOT NULL DEFAULT '',
  UNIQUE(id, user_id)
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL CHECK(length(trim(name)) > 0),
  UNIQUE(id, user_id)
);
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  subject_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  title TEXT NOT NULL CHECK(length(trim(title)) > 0),
  description TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL,
  priority TEXT NOT NULL CHECK(priority IN ('LOW','MEDIUM','HIGH')),
  status TEXT NOT NULL CHECK(status IN ('PENDING','COMPLETED')),
  FOREIGN KEY(subject_id, user_id) REFERENCES subjects(id, user_id) ON DELETE RESTRICT,
  FOREIGN KEY(category_id, user_id) REFERENCES categories(id, user_id) ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS subtasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK(length(trim(title)) > 0),
  completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0,1))
);
