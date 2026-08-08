const express = require("express");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const db = require("../db/db");

const router = express.Router();

// Ограничиваем попытки входа, чтобы нельзя было брутфорсить пароль
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Çox cəhd. Bir az sonra yenidən cəhd edin." },
  standardHeaders: true,
  legacyHeaders: false
});

router.post("/login", loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Məlumat çatışmır" });
  }

  const admin = db
    .prepare("SELECT * FROM admin WHERE username = ?")
    .get(username);

  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: "İstifadəçi adı və ya şifrə səhvdir" });
  }

  req.session.isAdmin = true;
  req.session.username = admin.username;
  res.json({ success: true, username: admin.username });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/me", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ isAdmin: true, username: req.session.username });
  }
  res.json({ isAdmin: false });
});

router.post("/change-password", (req, res) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({ error: "Yetkiniz yoxdur" });
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Yeni şifrə ən azı 6 simvol olmalıdır" });
  }

  const admin = db
    .prepare("SELECT * FROM admin WHERE username = ?")
    .get(req.session.username);

  if (!bcrypt.compareSync(currentPassword, admin.password_hash)) {
    return res.status(401).json({ error: "Cari şifrə səhvdir" });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE admin SET password_hash = ? WHERE id = ?").run(
    newHash,
    admin.id
  );
  res.json({ success: true });
});

module.exports = router;
