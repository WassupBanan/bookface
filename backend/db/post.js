import sqlite3 from "sqlite3";

export function createPostTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      authorId INTEGER NOT NULL,
      creationTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users(id)
      ON DELETE CASCADE
    )
  `);
}

export function insertPost(db, post) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        INSERT INTO posts
        (content, authorId)
        VALUES (?, ?)
      `,
      [
        post.content,
        post.authorId,
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

export function deletePost(
  db,
  postId,
  authorId
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        DELETE FROM posts
        WHERE id = ?
          AND authorId = ?
      `,
      [
        postId,
        authorId,
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

export function getPostsByUserIDs(
  db,
  userIds,
  options = {}
) {
  const {
    limit = 50,
    offset = 0,
  } = options;

  if (userIds.length === 0) {
    return Promise.resolve([]);
  }

  const placeholders =
    userIds.map(() => "?").join(",");

  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT
          posts.id,
          posts.content,
          posts.creationTime,
          posts.authorId,
          users.firstName,
          users.lastName,
          users.gender,
          users.avatarUrl
        FROM posts
        JOIN users
          ON posts.authorId = users.id
        WHERE posts.authorId IN (${placeholders})
        ORDER BY posts.id DESC
        LIMIT ? OFFSET ?
      `,
      [
        ...userIds,
        limit,
        offset,
      ],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(
          rows.map(transformPost)
        );
      }
    );
  });
}

export function getPosts(
  db,
  options = {}
) {
  const {
    limit = 50,
    offset = 0,
    userIdFilter,
  } = options;

  return new Promise((resolve, reject) => {
    const hasFilter =
      userIdFilter !== undefined;

    const sql = hasFilter
      ? `
        SELECT
          posts.id,
          posts.content,
          posts.creationTime,
          posts.authorId,
          users.firstName,
          users.lastName,
          users.gender,
          users.avatarUrl
        FROM posts
        JOIN users
          ON posts.authorId = users.id
        WHERE posts.authorId = ?
        ORDER BY posts.id DESC
        LIMIT ? OFFSET ?
      `
      : `
        SELECT
          posts.id,
          posts.content,
          posts.creationTime,
          posts.authorId,
          users.firstName,
          users.lastName,
          users.gender,
          users.avatarUrl
        FROM posts
        JOIN users
          ON posts.authorId = users.id
        ORDER BY posts.id DESC
        LIMIT ? OFFSET ?
      `;

    const params = hasFilter
      ? [
          userIdFilter,
          limit,
          offset,
        ]
      : [
          limit,
          offset,
        ];

    db.all(
      sql,
      params,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(
          rows.map(transformPost)
        );
      }
    );
  });
}

function transformPost(row) {
  return {
    id: row.id,
    content: row.content,
    creationTime: row.creationTime,

    author: {
      id: row.authorId,
      firstName: row.firstName,
      lastName: row.lastName,
      gender: row.gender,
      avatarUrl: row.avatarUrl,
    },
  };
}
