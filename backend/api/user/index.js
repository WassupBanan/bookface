import express from "express";

import {
  getUserById,
  getUsers,
  updateAvatar,
} from "../../db/user.js";

import {
  getFriendship,
} from "../../db/friend.js";

import {
  getDbConnection,
} from "../../db/index.js";

export const userRouter =
  express.Router();

userRouter.get(
  "/all",
  async (req, res) => {
    try {
      const db =
        getDbConnection();

      const users =
        await getUsers(
          db,
          {
            filter:
              req.query.q ?? "",
          }
        );

      db.close();

      res.json(users);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

userRouter.get(
  "/:id",
  async (req, res) => {
    try {
      const id =
        Number(req.params.id);

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res
          .status(400)
          .send("Invalid user");
      }

      const db =
        getDbConnection();

      const user =
        await getUserById(
          db,
          id
        );

      if (!user) {
        db.close();

        return res
          .status(404)
          .send("User not found");
      }

      const isFriend =
        Boolean(
          await getFriendship(
            db,
            req.userId,
            id
          )
        );

      db.close();

      res.json({
        ...user,
        isFriend,
      });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

userRouter.get(
  "/",
  async (req, res) => {
    try {
      const db =
        getDbConnection();

      const user =
        await getUserById(
          db,
          req.userId
        );

      db.close();

      if (!user) {
        return res
          .status(404)
          .send("User not found");
      }

      res.json(user);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

userRouter.patch(
  "/avatar",
  async (req, res) => {
    try {
      const {
        avatarUrl,
      } = req.body;

      if (
        typeof avatarUrl !==
          "string"
      ) {
        return res
          .status(400)
          .send(
            "avatarUrl is required"
          );
      }

      const db =
        getDbConnection();

      const updated =
        await updateAvatar(
          db,
          req.userId,
          avatarUrl.trim()
        );

      db.close();

      if (!updated) {
        return res
          .status(404)
          .send("User not found");
      }

      res.sendStatus(200);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);
