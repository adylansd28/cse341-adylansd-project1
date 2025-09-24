// auth/passport.js
import "dotenv/config"; // <-- asegura que .env está cargado aquí
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, CALLBACK_URL } = process.env;

// Validación defensiva para detectar el problema rápido
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !CALLBACK_URL) {
  console.error("Missing OAuth envs:", {
    GITHUB_CLIENT_ID: GITHUB_CLIENT_ID || "(undefined)",
    GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET ? "(set)" : "(undefined)",
    CALLBACK_URL: CALLBACK_URL || "(undefined)",
  });
  throw new Error("OAuth env vars missing. Check your .env and load order.");
}

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["user:email"],
    },
    (accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
