import sqlite3 from "sqlite3";

export function createUserTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      gender TEXT,
      avatarUrl TEXT
    )
  `);
}

export function insertUser(db, user) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO users
        (firstName, lastName, username, password, gender, avatarUrl)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user.firstName,
        user.lastName,
        user.username,
        user.password,
        user.gender ?? "",
        user.avatarUrl ?? "",
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.lastID);
      }
    );
  });
}

export function getUsers(db, options = {}) {
  const {
    limit = 10,
    offset = 0,
    filter = "",
  } = options;

  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          id,
          firstName,
          lastName,
          username,
          gender,
          avatarUrl
        FROM users
        WHERE username LIKE ?
           OR firstName LIKE ?
           OR lastName LIKE ?
        ORDER BY username ASC
        LIMIT ? OFFSET ?
      `,
      [
        `%${filter}%`,
        `%${filter}%`,
        `%${filter}%`,
        limit,
        offset,
      ],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      }
    );
  });
}

export function getUserById(db, id) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT
          id,
          firstName,
          lastName,
          username,
          gender,
          avatarUrl
        FROM users
        WHERE id = ?
      `,
      [id],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ?? null);
      }
    );
  });
}

export function getUserByUsername(db, username) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT *
        FROM users
        WHERE username = ?
      `,
      [username],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ?? null);
      }
    );
  });
}

export function updateAvatar(db, userId, avatarUrl) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE users
        SET avatarUrl = ?
        WHERE id = ?
      `,
      [avatarUrl, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.changes > 0);
      }
    );
  });
}
