import { Request, Response } from "express";
import {
  createUserService,
  getUserService,
  getUsersService,
} from "../services/user.service.js";

export const getUsersController = (req: Request, res: Response) => {
  const result = getUsersService();
  res.status(200).send(result);
};

export const createUserController = (req: Request, res: Response) => {
  const result = createUserService(req.body);
  res.status(200).send(result);
};

export const getUserController = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = getUserService(id);
  res.status(200).send(result);
};
