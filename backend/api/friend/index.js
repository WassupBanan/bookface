import express from "express";

import {
  getFriends,
  insertFriends,
  getFriendRequest,
  insertFriendRequest,
  deleteFriendRequest,
  getFriendship,
  deleteFriendship,
  getFriendRequests,
} from "../../db/friend.js";

import {
  getUserById,
} from "../../db/user.js";

import {
  getDbConnection,
} from "../../db/index.js";

export const friendRouter =
  express.Router();

friendRouter.get(
  "/",
  async (req, res) => {
    try {
      const db =
        getDbConnection();

      const friends =
        await getFriends(
          db,
          req.userId
        );

      db.close();

      res.json(friends);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

friendRouter.post(
  "/addFriend",
  async (req, res) => {
    try {
      const friendId =
        Number(
          req.body.friendId
        );

      if (
        !Number.isInteger(
          friendId
        )
      ) {
        return res
          .status(400)
          .send(
            "Friend ID is required"
          );
      }

      if (
        friendId ===
        req.userId
      ) {
        return res
          .status(400)
          .send(
            "Cannot add yourself as a friend"
          );
      }

      const db =
        getDbConnection();

      const friend =
        await getUserById(
          db,
          friendId
        );

      if (!friend) {
        db.close();

        return res
          .status(404)
          .send(
            "User not found"
          );
      }

      const friendship =
        await getFriendship(
          db,
          req.userId,
          friendId
        );

      if (friendship) {
        db.close();

        return res
          .status(400)
          .send(
            "Already friends"
          );
      }

      const outgoing =
        await getFriendRequest(
          db,
          req.userId,
          friendId
        );

      if (outgoing) {
        db.close();

        return res
          .status(400)
          .send(
            "Friend request already sent"
          );
      }

      const incoming =
        await getFriendRequest(
          db,
          friendId,
          req.userId
        );

      if (incoming) {
        await deleteFriendRequest(
          db,
          incoming.id
        );

        await insertFriends(
          db,
          req.userId,
          friendId
        );

        db.close();

        return res.sendStatus(
          200
        );
      }

      await insertFriendRequest(
        db,
        req.userId,
        friendId
      );

      db.close();

      res.sendStatus(200);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

friendRouter.post(
  "/deleteFriend",
  async (req, res) => {
    try {
      const otherId =
        Number(
          req.body.otherId
        );

      if (
        !Number.isInteger(
          otherId
        )
      ) {
        return res
          .status(400)
          .send(
            "Other ID is required"
          );
      }

      if (
        otherId ===
        req.userId
      ) {
        return res
          .status(400)
          .send(
            "Cannot remove yourself"
          );
      }

      const db =
        getDbConnection();

      const outgoing =
        await getFriendRequest(
          db,
          req.userId,
          otherId
        );

      const incoming =
        await getFriendRequest(
          db,
          otherId,
          req.userId
        );

      const request =
        outgoing || incoming;

      if (request) {
        await deleteFriendRequest(
          db,
          request.id
        );

        db.close();

        return res.sendStatus(
          200
        );
      }

      const friendship =
        await getFriendship(
          db,
          req.userId,
          otherId
        );

      if (!friendship) {
        db.close();

        return res
          .status(404)
          .send(
            "Friendship not found"
          );
      }

      await deleteFriendship(
        db,
        friendship.id
      );

      db.close();

      res.sendStatus(200);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

friendRouter.get(
  "/requests",
  async (req, res) => {
    try {
      const db =
        getDbConnection();

      const requests =
        await getFriendRequests(
          db,
          req.userId
        );

      db.close();

      res.json(requests);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);
