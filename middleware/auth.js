// middleware/auth.js
export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "You do not have access." });
  }
  next();
};