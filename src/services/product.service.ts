import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { PaginationQueryParams } from "../types/pagination.js";

interface GetProductsQuery extends PaginationQueryParams {
  search?: string;
}

export const getProductsService = async (query: GetProductsQuery) => {
  const { page, sortBy, sortOrder, take, search } = query;

  const whereClause: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    skip: (page - 1) * take,
    take: take,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.product.count({ where: whereClause });

  return {
    data: products,
    meta: { page, take, total },
  };
};
