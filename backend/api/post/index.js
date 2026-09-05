import express from "express";

import {
  getPosts,
  getPostsByUserIDs,
  insertPost,
  deletePost,
} from "../../db/post.js";

import {
  getFriendship,
  getFriends,
} from "../../db/friend.js";

import {
  getDbConnection,
} from "../../db/index.js";

export const postRouter =
  express.Router();

postRouter.get(
  "/",
  async (req, res) => {
    try {
      const db =
        getDbConnection();

      let userId =
        req.query.userId;

      if (!userId) {
        const friends =
          await getFriends(
            db,
            req.userId
          );

        const friendIds =
          friends.map(
            (friend) =>
              friend.friendId
          );

        // Include the current user's posts
        // in their own feed.
        const feedUserIds = [
          req.userId,
          ...friendIds,
        ];

        const posts =
          await getPostsByUserIDs(
            db,
            feedUserIds
          );

        db.close();

        return res.json(posts);
      }

      userId =
        Number(userId);

      if (
        !Number.isInteger(
          userId
        )
      ) {
        db.close();

        return res
          .status(400)
          .send(
            "Invalid userId"
          );
      }

      if (
        req.userId !==
        userId
      ) {
        const areFriends =
          await getFriendship(
            db,
            req.userId,
            userId
          );

        if (!areFriends) {
          db.close();

          return res
            .status(403)
            .send(
              "Not friends"
            );
        }
      }

      const posts =
        await getPosts(
          db,
          {
            userIdFilter:
              userId,
          }
        );

      db.close();

      res.json(posts);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

postRouter.post(
  "/",
  async (req, res) => {
    try {
      const content =
        typeof req.body.content ===
        "string"
          ? req.body.content.trim()
          : "";

      if (!content) {
        return res
          .status(400)
          .send(
            "Post content is required"
          );
      }

      if (content.length > 5000) {
        return res
          .status(400)
          .send(
            "Post is too long"
          );
      }

      const db =
        getDbConnection();

      const postId =
        await insertPost(
          db,
          {
            content,
            authorId:
              req.userId,
          }
        );

      db.close();

      res.status(201).json({
        id: postId,
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

postRouter.delete(
  "/:postId",
  async (req, res) => {
    try {
      const postId =
        Number(
          req.params.postId
        );

      if (
        !Number.isInteger(
          postId
        )
      ) {
        return res
          .status(400)
          .send(
            "Invalid post ID"
          );
      }

      const db =
        getDbConnection();

      const deleted =
        await deletePost(
          db,
          postId,
          req.userId
        );

      db.close();

      if (!deleted) {
        return res
          .status(404)
          .send(
            "Post not found"
          );
      }

      res.sendStatus(204);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);
