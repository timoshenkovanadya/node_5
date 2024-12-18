const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secret-key1!";
let users = require("./manager.json");

const filmsRouter = require("./routes/routerFilms");
const authRouter = require("./routes/routerAuth");
app.use(express.json());

app.use("/", (req, res, next) => {
  if (req.url === "/api/auth/login" || req.url === "/api/auth/register") {
    return next();
  }
  if (!req.headers["authorization"]) {
    return next({ status: 401, message: "Unauthorized" });
  }
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded) {
      return next({ status: 403, message: "Forbidden" });
    }
    req.user = decoded;
  } catch {
    return next({ status: 403, message: "Forbidden" });
  }
  next();
});

app.use("/api/films", filmsRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.listen(3000, function () {
  console.log("Running");
});
