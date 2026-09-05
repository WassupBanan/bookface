import express from "express";

import { userRouter } from "./user/index.js";
import { authRouter } from "./auth/index.js";
import { postRouter } from "./post/index.js";
import { friendRouter } from "./friend/index.js";

import {
  getUidBySessionId,
} from "../db/auth.js";

import {
  getDbConnection,
} from "../db/index.js";

export const apiRouter =
  express.Router();

apiRouter.use(
  "/auth",
  authRouter
);

apiRouter.use(
  async (req, res, next) => {
    try {
      const sessionId =
        req.cookies.SID;

      if (!sessionId) {
        return res
          .status(401)
          .send("Unauthorized");
      }

      const db =
        getDbConnection();

      const userId =
        await getUidBySessionId(
          db,
          sessionId
        );

      db.close();

      if (!userId) {
        res.clearCookie("SID");

        return res
          .status(401)
          .send("Unauthorized");
      }

      req.userId = userId;

      next();
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .send("Server error");
    }
  }
);

apiRouter.use(
  "/user",
  userRouter
);

apiRouter.use(
  "/post",
  postRouter
);

apiRouter.use(
  "/friend",
  friendRouter
);
