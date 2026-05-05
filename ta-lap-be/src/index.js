// import dotenv from "dotenv";
// dotenv.config();

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function test() {
//   try {
//     const users = await prisma.user.findMany();
//     console.log(users);
//   } catch (err) {
//     console.error(err);
//   }
// }

// test();


// import express from "express";
// import { PrismaClient } from "@prisma/client";

// const app = express();
// const prisma = new PrismaClient();

// app.get("/", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// app.listen(3002, () => {
//   console.log("Server jalan di http://localhost:3002");
// });

// import express from "express";
// import cors from "cors";

// import authRoutes from "./routes/authRoutes.js";
// import lapanganRoutes from "./routes/lapanganRoutes.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/auth", authRoutes);
// app.use("/lapangan", lapanganRoutes);

// app.listen(3002, () => {
//   console.log("Server jalan di port 3002");
// });


import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import lapanganRoutes from "./routes/lapanganRoutes.js";
import pesananRoutes from "./routes/pesananRoutes.js";
import pembayaranRoutes from "./routes/pembayaranRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/lapangan", lapanganRoutes);
app.use("/pesanan", pesananRoutes);
app.use("/pembayaran", pembayaranRoutes);
// pakai route
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server jalan di port ${process.env.PORT}`);
});