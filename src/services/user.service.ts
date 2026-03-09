import { Prisma, User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { PaginationQueryParams } from "../types/pagination.js";
import { ApiError } from "../utils/api-error.js";

interface GetUsersQuery extends PaginationQueryParams {
  search?: string;
}

export const getUsersService = async (query: GetUsersQuery) => {
  const { page, sortBy, sortOrder, take, search } = query;

  const whereClause: Prisma.UserWhereInput = {
    deletedAt: null,
  };

  if (search) {
    whereClause.name = { contains: search, mode: "insensitive" };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    omit: { password: true },
    skip: (page - 1) * take,
    take: take,
    orderBy: { [sortBy]: sortOrder },
    include: {
      addresses: {
        select: { street: true, city: true },
      },
    },
  });

  const total = await prisma.user.count({ where: whereClause });

  return {
    data: users,
    meta: { page, take, total },
  };
};

export const createUserService = async (
  body: Pick<User, "name" | "email" | "password">,
) => {
  await prisma.$transaction(async (tx) => {
    // process 1
    const newUser = await tx.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        role: "USER",
      },
    });

    // process 2
    await tx.address.create({
      data: {
        city: "Jakarta Barat",
        street: "Jl. Jakarta",
        userId: newUser.id,
      },
    });
  });

  return { message: "create new user success" };
};

export const getUserService = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id, deletedAt: null },
    omit: { password: true },
  });

  if (!user) throw new ApiError("user not found", 404);

  return user;
};

export const updateUserService = async (id: number, body: Partial<User>) => {
  // 1. cek dulu di db ada ga data user berdasarkan id
  await getUserService(id);

  // 2. kalo user nya update email, cek dulu di db udh ada yg pake atau belom
  if (body.email) {
    const userEmail = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (userEmail) {
      throw new ApiError("email already exist", 400);
    }
  }

  // 3. update data usernya berdasarkan id
  await prisma.user.update({
    where: { id },
    data: body,
  });

  return { message: "update user success" };
};

export const deleteUserService = async (id: number) => {
  await getUserService(id);

  // // HARD DELETE
  // await prisma.user.delete({
  //   where: { id },
  // });

  // SOFT DELETE
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { message: "delete user success" };
};
