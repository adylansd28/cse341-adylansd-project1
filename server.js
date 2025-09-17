import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./data/database.js";
import router from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// en server.js, antes de app.use(notFound);
app.get("/", (req, res) => {
  res.json({
    name: "Fitness Tracker API",
    version: "1.0.0",
    docs: "/api-docs",
    health: "/health"
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
      console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });