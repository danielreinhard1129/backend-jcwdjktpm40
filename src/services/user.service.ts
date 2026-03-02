import { ApiError } from "../utils/api-error.js";
import { getData, writeData } from "../utils/data.js";

export const getUsersService = () => {
  const result = JSON.parse(getData());
  return result.users;
};

export const createUserService = (body: { name: string }) => {
  // 1. get seluruh data users
  const result = JSON.parse(getData());

  // 2. ambil latest id
  const latestId = result.users[result.users.length - 1].id;

  // 3. tambahkan data baru berdasarkan req body
  result.users.push({
    id: latestId + 1,
    name: body.name,
  });

  // 4. jalankan fungsi writeData berdasarkan data yg sudah ditambahkan
  writeData(JSON.stringify(result));

  return { message: "Add new user success" };
};

export const getUserService = (id: number) => {
  // 1. ambil seluruh data
  const users = getUsersService();

  // 2. looping seluruh isi data untuk mencari berdasarkan id
  const user = users.find((user: { id: number; name: string }) => {
    return user.id === id;
  });

  // 3. kalo tidak ketemu kirim response balik 404 / user not found
  if (!user) {
    throw new ApiError("User not found", 400);
  }

  // 4. kalo ketemu kirim data user nya
  return user;
};
