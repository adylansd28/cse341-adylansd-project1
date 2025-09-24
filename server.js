import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import "./auth/passport.js"; // Registra la estrategia GitHub
import { connectToDatabase } from "./data/database.js";
import router from "./routes/index.js";
import authRouter from "./routes/auth.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

dotenv.config();
const app = express();

/* ---------- Seguridad / utilidades ---------- */
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

/* ---------- Sesión (requerida por passport.session) ---------- */
app.set("trust proxy", 1);
app.use(
  session({
    // IMPORTANTE: define SESSION_SECRET en .env
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // name: "connect.sid", // (opcional) personaliza nombre de cookie
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    },
  })
);

/* ---------- Passport ---------- */
app.use(passport.initialize());
app.use(passport.session());

/* ---------- Rutas ---------- */
app.use("/api", router);
app.use("/auth", authRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* Home: muestra estado de sesión estilo profe */
app.get("/", (req, res) => {
  const u = req.session.user;
  res.send(u ? `Logged in as ${u.displayName || u.username || u.id}` : "Logged Out");
});

/* Info / health */
app.get("/info", (_req, res) => {
  res.json({
    name: "Fitness Tracker API",
    version: "1.0.0",
    docs: "/api-docs",
    health: "/health",
  });
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

/* Logout GET → destruye sesión y redirige al home */
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // si personalizas "name", usa ese nombre aquí
      res.redirect("/");
    });
  });
});

/* Middlewares de error */
app.use(notFound);
app.use(errorHandler);

/* ---------- Inicio del servidor ---------- */
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