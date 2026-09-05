import sqlite3 from "sqlite3";

import { config } from "../config/index.js";
import { createUserTable } from "./user.js";
import { createSessionTable } from "./auth.js";
import { createPostTable } from "./post.js";
import { createFriendTables } from "./friend.js";

export function getDbConnection() {
  return new sqlite3.Database(
    config.sqliteDbInfo.filename
  );
}

export function syncSchema(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      createUserTable(db);
      createPostTable(db);
      createSessionTable(db);
      createFriendTables(db);

      db.run("PRAGMA foreign_keys = ON", (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  });
}
