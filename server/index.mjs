// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import authRoutes from "./routes/authRoutes.mjs";
// import taskRoutes from "./routes/taskRoutes.mjs";
// dotenv.config();
// import "./config/dbconfig.mjs"
// import { createRequire } from "module";
// import swaggerUi from "swagger-ui-express";
// const require = createRequire(import.meta.url);

// import swaggerSpec from "./swagger.mjs"
// import swaggerDocument from "./swagger-output.json";

// const app = express();


// app.use(cors());
// app.use(express.json());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);

// const port = process.env.PORT || 5000;

// app.listen(port, ()=>{
//     console.log(`Server is running on http://localhost:${port}`)
// })

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";
import taskRoutes from "./routes/taskRoutes.mjs";
import { createRequire } from "module";
import swaggerUi from "swagger-ui-express";

const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger-output.json"); // only import JSON

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});