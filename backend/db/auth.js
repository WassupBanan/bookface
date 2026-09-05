import sha2 from "sha2";

import { config } from "../config/index.js";

export function createSessionTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionId TEXT UNIQUE NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
      ON DELETE CASCADE
    )
  `);
}

export function getUIDByCredentials(db, credentials) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT id
        FROM users
        WHERE username = ?
          AND password = ?
      `,
      [
        credentials.username,
        credentials.password,
      ],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ? row.id : null);
      }
    );
  });
}

export function deleteSession(db, sessionId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        DELETE FROM sessions
        WHERE sessionId = ?
      `,
      [sessionId],
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

export function newSession(db, user) {
  return new Promise((resolve, reject) => {
    if (!user.username) {
      reject(new Error("Username is required"));
      return;
    }

    if (!user.id) {
      reject(new Error("User ID is required"));
      return;
    }

    const sessionId = generateSessionId(
      user.username
    );

    assignSessionToUser(db, {
      sessionId,
      userId: user.id,
    })
      .then(() => resolve(sessionId))
      .catch(reject);
  });
}

export function getUidBySessionId(db, sessionId) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT userId
        FROM sessions
        WHERE sessionId = ?
      `,
      [sessionId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(row ? row.userId : null);
      }
    );
  });
}

export function insertSession(db, session) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO sessions
        (sessionId, userId)
        VALUES (?, ?)
      `,
      [
        session.sessionId,
        session.userId,
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

function getSessionByUserID(db, userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT *
        FROM sessions
        WHERE userId = ?
      `,
      [userId],
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

function updateSession(db, session) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE sessions
        SET sessionId = ?
        WHERE userId = ?
      `,
      [
        session.sessionId,
        session.userId,
      ],
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
}

async function assignSessionToUser(db, session) {
  const existingSession =
    await getSessionByUserID(
      db,
      session.userId
    );

  if (existingSession) {
    await updateSession(db, session);
  } else {
    await insertSession(db, session);
  }
}

function generateSessionId(username) {
  const sessionIdBuffer = sha2.sha224(
    username +
      Date.now() +
      Math.random() +
      config.sessionSalt
  );

  return sessionIdBuffer.toString("hex");
}
