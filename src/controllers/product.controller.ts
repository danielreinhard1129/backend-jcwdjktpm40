import { Request, Response } from "express";
import { getProductsService } from "../services/product.service.js";

export const getProductsController = async (req: Request, res: Response) => {
  const query = {
    page: parseInt(req.query.page as string) || 1,
    take: parseInt(req.query.take as string) || 10,
    sortOrder: (req.query.sortOrder as string) || "desc",
    sortBy: (req.query.sortBy as string) || "createdAt",
    search: (req.query.search as string) || "",
  };

  const result = await getProductsService(query);
  res.status(200).send(result);
};
