// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import path from "path";

// import { connectDB } from "./lib/db.js";

// import authRoutes from "./route/auth.route.js";
// import messageRoutes from "./route/message.route.js";
// //=== this is line changed    for future dev==
// // import { app, server } from "./lib/socket.js";

// const app = express();

  
// dotenv.config();

// const PORT = process.env.PORT;
// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.post("/", (req, res) => {
//   console.log("API is running...");
//   res.json({ message: "API is running..." } );
// }); 

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Frontend/vite-project/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/vite-project/dist/index.html"));
  });
}

// // server.listen(PORT,"0.0.0.0", () => {
// //   console.log("server is running on PORT:" + PORT);
// //   connectDB();
// // });
    
// //== this above is for future dev==

// app.listen(PORT,"0.0.0.0", () => {
//   console.log("server is running on PORT:" + PORT);
//   connectDB();
// });


import express from "express";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// 🔌 Express + Socket
import { app, server } from "./lib/socket.js";

// 🗄️ DB
import { connectDB } from "./lib/db.js";

// 🛣️ Routes
import authRoutes from "./route/auth.route.js";
import messageRoutes from "./route/message.route.js";
import groupRoutes from "./route/group.route.js";
import statusRoutes from "./route/status.route.js";
import chatThemeRoutes from "./route/chatTheme.route.js";
import callRoutes from "./route/call.route.js";

dotenv.config();

const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();
const frontendUrls = (process.env.FRONTEND_URLS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

// ==================
// MIDDLEWARES
// ==================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: frontendUrls,
    credentials: true,
  })
);

// ==================
// ROUTES
// ==================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/theme", chatThemeRoutes);
app.use("/api/calls", callRoutes);

// ==================
// MULTER ERROR HANDLER
// ==================
app.use((err, req, res, next) => {
  if (err && (err.name === "MulterError" || err instanceof multer.MulterError)) {
    console.error("Multer error:", err.message || err);
    return res.status(400).json({
      message: err.message || "File upload error",
      hint:
        "Ensure every form-data entry has a non-empty Key and do not set Content-Type manually"
    });
  }
  next(err);
});

// ==================
// START SERVER
// ==================
server.listen(PORT, "0.0.0.0", async () => {
  console.log("🚀 Server running on PORT:", PORT);
  await connectDB();
});
