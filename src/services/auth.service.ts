import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const registerService = async (
  body: Pick<User, "name" | "email" | "password">,
) => {
  // 1. cek dulu emailnya udh kepake atau belom
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo udh kepake throw error
  if (user) {
    throw new ApiError("Email already exist", 400);
  }

  // 3. kalo belom kepake, hash password dari body.password
  const hashedPassword = await hash(body.password);

  // 4. create data user baru berdasarkan body dan hashed password
  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "USER",
    },
  });

  // 5. return message register success
  return { message: "register new user success" };
};

export const loginService = async (body: Pick<User, "email" | "password">) => {
  // 1. cek emailnya ada di db atau tidak
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  // 2. kalo tidak ada throw error
  if (!user) {
    throw new ApiError("Invalid credentials", 400);
  }

  // 3. cek password nya valid atau tidak
  const isPassMatch = await verify(user.password, body.password);

  // 4. kalo tidak valid throw error
  if (!isPassMatch) {
    throw new ApiError("Invalid credentials", 400);
  }

  // 5. generate token menggunakan jwt (jsonwebtoken)
  const payload = {
    id: user.id,
    role: user.role,
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "2h",
  });

  // 6. return message login success + data user + token
  const { password, ...userWithoutPassword } = user; // remove property password
  return {
    message: "Login success",
    data: userWithoutPassword,
    accessToken: accessToken,
  };
};
