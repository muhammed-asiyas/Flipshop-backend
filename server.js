require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orders");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

connectDB(
  process.env.MONGO_URI ||
    "mongodb+srv://asiyas:Asiyas100@asiyas.9m2p8h0.mongodb.net/flipshop-app"
);

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "x-session-id"],
  })
);

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));