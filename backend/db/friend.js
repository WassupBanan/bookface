import sqlite3 from "sqlite3";

function createFriendTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId1 INTEGER NOT NULL,
      userId2 INTEGER NOT NULL,

      UNIQUE (userId1, userId2),

      CHECK (userId1 < userId2),

      FOREIGN KEY (userId1)
        REFERENCES users(id)
        ON DELETE CASCADE,

      FOREIGN KEY (userId2)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);
}

function createRequestTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS friendRequests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fromUserId INTEGER NOT NULL,
      toUserId INTEGER NOT NULL,

      UNIQUE (fromUserId, toUserId),

      CHECK (fromUserId != toUserId),

      FOREIGN KEY (fromUserId)
        REFERENCES users(id)
        ON DELETE CASCADE,

      FOREIGN KEY (toUserId)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);
}

export function createFriendTables(db) {
  createFriendTable(db);
  createRequestTable(db);
}

export function insertFriends(
  db,
  userId1,
  userId2
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT OR IGNORE INTO friends
        (userId1, userId2)
        VALUES (?, ?)
      `,
      [
        Math.min(userId1, userId2),
        Math.max(userId1, userId2),
      ],
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

export function getFriendship(
  db,
  userId1,
  userId2
) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT id
        FROM friends
        WHERE userId1 = ?
          AND userId2 = ?
      `,
      [
        Math.min(userId1, userId2),
        Math.max(userId1, userId2),
      ],
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

export function deleteFriendship(
  db,
  friendshipId
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        DELETE FROM friends
        WHERE id = ?
      `,
      [friendshipId],
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

export function insertFriendRequest(
  db,
  fromUserId,
  toUserId
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO friendRequests
        (fromUserId, toUserId)
        VALUES (?, ?)
      `,
      [
        fromUserId,
        toUserId,
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

export function deleteFriendRequest(
  db,
  requestId
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        DELETE FROM friendRequests
        WHERE id = ?
      `,
      [requestId],
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

export function getFriendRequest(
  db,
  fromUserId,
  toUserId
) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT *
        FROM friendRequests
        WHERE fromUserId = ?
          AND toUserId = ?
      `,
      [
        fromUserId,
        toUserId,
      ],
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

export function getFriends(
  db,
  userId
) {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          friends.id,
          friends.userId1,
          friends.userId2,
          users.id AS friendUserId,
          users.firstName,
          users.lastName,
          users.gender,
          users.avatarUrl
        FROM friends
        JOIN users
          ON (
            friends.userId1 = users.id
            OR friends.userId2 = users.id
          )
        WHERE
          (
            friends.userId1 = ?
            OR friends.userId2 = ?
          )
          AND users.id != ?
      `,
      [
        userId,
        userId,
        userId,
      ],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(
          rows.map((row) => ({
            friendId: row.friendUserId,
            fullName:
              `${row.firstName} ${row.lastName}`,
            firstName: row.firstName,
            lastName: row.lastName,
            gender: row.gender,
            avatarUrl: row.avatarUrl,
          }))
        );
      }
    );
  });
}

export function getFriendRequests(
  db,
  userId
) {
  return Promise.all([
    getIncomingFriendRequests(
      db,
      userId
    ),
    getOutgoingFriendRequests(
      db,
      userId
    ),
  ]).then(
    ([incoming, outgoing]) => ({
      incoming,
      outgoing,
    })
  );
}

function getIncomingFriendRequests(
  db,
  userId
) {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          friendRequests.id,
          friendRequests.fromUserId,
          friendRequests.toUserId,
          users.firstName,
          users.lastName,
          users.gender,
          users.avatarUrl
        FROM friendRequests
        JOIN users
          ON friendRequests.fromUserId = users.id
        WHERE friendRequests.toUserId = ?
      `,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(
          rows.map((row) => ({
            requestId: row.id,
            otherId: row.fromUserId,
            fullName:
              `${row.firstName} ${row.lastName}`,
            firstName: row.firstName,
            lastName: row.lastName,
            gender: row.gender,
            avatarUrl: row.avatarUrl,
          }))
        );
      }
    );
  });
}

function getOutgoingFriendRequests(
  db,
  userId
) {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          friendRequests.id,
          friendRequests.fromUserId,
          friendRequests.toUserId,
          users.firstName,
          users.lastName,
          users.gender,
          users.avatarUrl
        FROM friendRequests
        JOIN users
          ON friendRequests.toUserId = users.id
        WHERE friendRequests.fromUserId = ?
      `,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(
          rows.map((row) => ({
            requestId: row.id,
            otherId: row.toUserId,
            fullName:
              `${row.firstName} ${row.lastName}`,
            firstName: row.firstName,
            lastName: row.lastName,
            gender: row.gender,
            avatarUrl: row.avatarUrl,
          }))
        );
      }
    );
  });
}
