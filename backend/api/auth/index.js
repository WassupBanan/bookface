import express from "express";

import {
  getUIDByCredentials,
  newSession,
  deleteSession,
  getUidBySessionId,
} from "../../db/auth.js";

import {
  getDbConnection,
} from "../../db/index.js";

import {
  insertUser,
  getUserByUsername,
} from "../../db/user.js";

export const authRouter =
  express.Router();

authRouter.post(
  "/login",
  async (req, res) => {
    try {
      const {
        username,
        password,
      } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .send("Username and password are required");
      }

      const db =
        getDbConnection();

      const uid =
        await getUIDByCredentials(
          db,
          {
            username,
            password,
          }
        );

      if (!uid) {
        db.close();

        return res
          .status(401)
          .send("Invalid username or password");
      }

      const sessionId =
        await newSession(
          db,
          {
            username,
            id: uid,
          }
        );

      db.close();

      res.cookie(
        "SID",
        sessionId,
        {
          maxAge:
            30 *
            24 *
            60 *
            60 *
            1000,

          httpOnly: true,

          sameSite: "lax",
        }
      );

      res.sendStatus(200);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

authRouter.post(
  "/register",
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        username,
        password,
        gender,
        avatarUrl,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !username ||
        !password
      ) {
        return res
          .status(400)
          .send(
            "First name, last name, username and password are required"
          );
      }

      if (username.length < 3) {
        return res
          .status(400)
          .send(
            "Username must be at least 3 characters"
          );
      }

      if (password.length < 4) {
        return res
          .status(400)
          .send(
            "Password must be at least 4 characters"
          );
      }

      const db =
        getDbConnection();

      const existing =
        await getUserByUsername(
          db,
          username
        );

      if (existing) {
        db.close();

        return res
          .status(409)
          .send(
            "Username is already taken"
          );
      }

      await insertUser(
        db,
        {
          firstName,
          lastName,
          username,
          password,
          gender:
            gender ?? "",
          avatarUrl:
            avatarUrl ?? "",
        }
      );

      db.close();

      res.sendStatus(201);
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

authRouter.post(
  "/logout",
  async (req, res) => {
    try {
      const sessionId =
        req.cookies.SID;

      res.clearCookie("SID");

      if (!sessionId) {
        return res.sendStatus(200);
      }

      const db =
        getDbConnection();

      await deleteSession(
        db,
        sessionId
      );

      db.close();

      res.sendStatus(200);
    } catch (error) {
      console.error(error);

      res.sendStatus(200);
    }
  }
);
