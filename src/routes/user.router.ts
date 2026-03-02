import express from "express";
import {
  createUserController,
  getUserController,
  getUsersController,
} from "../controllers/user.controller.js";
import { createUserValidator } from "../validators/user.validator.js";

const userRouter = express.Router();

userRouter.get("/", getUsersController);
userRouter.get("/:id", getUserController);
userRouter.post("/", createUserValidator, createUserController);

export { userRouter };
