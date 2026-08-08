function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ error: "Yetkiniz yoxdur / Не авторизован" });
}

module.exports = { requireAuth };
