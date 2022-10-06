CREATE TABLE IF NOT EXISTS admin (
	user_id INTEGER
);


CREATE TABLE IF NOT EXISTS users (
	user_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_name TEXT NOT NULL UNIQUE,
	nickname TEXT NOT NULL,
	password TEXT NOT NULL,
	create_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
	update_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TRIGGER IF NOT EXISTS trg_users_upd AFTER UPDATE ON users
BEGIN
    UPDATE users
    SET update_at = DATETIME('now', 'localtime') 
    WHERE rowid == NEW.rowid;
END;


CREATE TABLE IF NOT EXISTS message (
	message_id INTEGER PRIMARY KEY AUTOINCREMENT,
	message TEXT NOT NULL,
	send_from INTEGER NOT NULL,
	send_to INTEGER NOT NULL,
	create_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
	update_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);


CREATE TRIGGER IF NOT EXISTS trg_message_upd AFTER UPDATE ON message
BEGIN
	UPDATE message
	SET update_at = DATETIME('now', 'localtime')
	WHERE rowid == NEW.rowid;
END;