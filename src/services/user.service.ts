import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const getUsersService = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
    // select: { id: true, name: true },
  });
  return users;
};

export const createUserService = async (
  body: Pick<User, "name" | "email" | "password">,
) => {
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
      role: "USER",
    },
  });

  return { message: "create new user success" };
};

export const getUserService = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
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

  await prisma.user.delete({
    where: { id },
  });

  return { message: "delete user success" };
};
