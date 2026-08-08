require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const settingsRoutes = require("./routes/settings");
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");

const app = express();

// Render (и большинство PaaS) стоят за reverse proxy — без этого secure-cookies
// и rate-limit по IP работают некорректно
app.set("trust proxy", 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

// Лимит побольше для body — приходят base64-фото на upload-image
app.use(express.json({ limit: "10mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 дней
    }
  })
);

// Общий лимит запросов на весь API — базовая защита от DDoS/скрапинга
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});
app.use("/api", globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Обработчик ошибок — чтобы никогда не улетал сырой stack trace клиенту
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server xətası" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sosuslar backend işə düşdü: port ${PORT}`);
});
