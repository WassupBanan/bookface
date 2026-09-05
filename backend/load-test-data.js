import fs from "fs";

import {
  syncSchema,
  getDbConnection,
} from "./db/index.js";

import {
  insertUser,
} from "./db/user.js";

import {
  insertSession,
} from "./db/auth.js";

import {
  insertPost,
} from "./db/post.js";

import {
  insertFriends,
  insertFriendRequest,
} from "./db/friend.js";

import {
  config,
} from "./config/index.js";

async function loadTestData() {
  console.log(
    "Deleting database..."
  );

  fs.rmSync(
    config.sqliteDbInfo.filename,
    {
      force: true,
    }
  );

  const db =
    getDbConnection();

  await syncSchema(db);

  console.log(
    "Loading users..."
  );

  const users = [
    {
      firstName: "Luciano",
      lastName: "Pacocha",
      username:
        "luciano.pacocha",
      password: "123456",
      gender: "male",
      avatarUrl:
        "https://randomuser.me/api/portraits/men/1.jpg",
    },

    {
      firstName: "Florence",
      lastName: "Jane",
      username: "florence1",
      password: "123456",
      gender: "female",
      avatarUrl:
        "https://randomuser.me/api/portraits/women/1.jpg",
    },

    {
      firstName: "Loraine",
      lastName: "Streich",
      username:
        "loraine.streich",
      password: "123456",
      gender: "female",
      avatarUrl:
        "https://randomuser.me/api/portraits/women/2.jpg",
    },

    {
      firstName: "Test",
      lastName: "User",
      username: "test",
      password: "123456",
      gender: "male",
      avatarUrl:
        "https://randomuser.me/api/portraits/lego/6.jpg",
    },
  ];

  for (const user of users) {
    await insertUser(
      db,
      user
    );
  }

  console.log(
    "Loading posts..."
  );

  const posts = [
    {
      content:
        "Hello from Luciano!",
      authorId: 1,
    },

    {
      content:
        "This is Florence's first post.",
      authorId: 2,
    },

    {
      content:
        "Loraine is testing BookFace.",
      authorId: 3,
    },

    {
      content:
        "Hello everyone! This is the test account.",
      authorId: 4,
    },

    {
      content:
        "Another post for the feed.",
      authorId: 1,
    },

    {
      content:
        "BookFace is working!",
      authorId: 2,
    },
  ];

  for (const post of posts) {
    await insertPost(
      db,
      post
    );
  }

  console.log(
    "Loading friends..."
  );

  await insertFriends(
    db,
    1,
    4
  );

  await insertFriends(
    db,
    2,
    4
  );

  console.log(
    "Loading friend request..."
  );

  await insertFriendRequest(
    db,
    4,
    3
  );

  console.log(
    "Loading test session..."
  );

  await insertSession(
    db,
    {
      userId: 4,

      sessionId:
        "ab585c3964635054d9f253240536a8ce1a8cc9865a74960bbd2bf35d",
    }
  );

  db.close();

  console.log(
    "Test data loaded successfully!"
  );

  console.log(
    "Test account:"
  );

  console.log(
    "Username: test"
  );

  console.log(
    "Password: 123456"
  );
}

loadTestData().catch(
  (error) => {
    console.error(
      "Failed to load test data:",
      error
    );

    process.exit(1);
  }
);
