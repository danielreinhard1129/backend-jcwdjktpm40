import express from "express";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";

const PORT = 8000;
const app = express();

app.use(express.json()); // agar bisa menerima req.body

const getData = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, "./db.json");
  const rawData = fs.readFileSync(filePath).toString();
  return rawData;
};

const writeData = (data: string) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, "./db.json");
  fs.writeFileSync(filePath, data);
};

app.get("/api", (req, res) => {
  res.status(200).send("Welcome to My API");
});

app.get("/users", (req, res) => {
  const result = JSON.parse(getData());
  res.status(200).send(result.users);
});

app.post("/users", (req, res) => {
  // 1. get seluruh data users
  const result = JSON.parse(getData());

  // 2. ambil latest id
  const latestId = result.users[result.users.length - 1].id;

  // 3. tambahkan data baru berdasarkan req body
  result.users.push({
    id: latestId + 1,
    name: req.body.name,
  });

  // 4. jalankan fungsi writeData berdasarkan data yg sudah ditambahkan
  writeData(JSON.stringify(result));

  // 5. kirim response balik add new user success
  res.status(200).send({ message: "Add new user success" });
});

app.use((req, res) => res.status(404).send({ message: "route not found" }));

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
