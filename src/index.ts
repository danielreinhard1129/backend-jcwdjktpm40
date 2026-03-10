import express from "express";
import { authRouter } from "./routes/auth.router.js";
import { userRouter } from "./routes/user.router.js";
import { globalError, notFoundError } from "./utils/errors.js";

const PORT = 8000;
const app = express();

app.use(express.json()); // agar bisa menerima req.body

// entry point
app.use("/users", userRouter);
app.use("/auth", authRouter);

//errors
app.use(globalError);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
