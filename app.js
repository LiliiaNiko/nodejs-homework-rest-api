const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const router = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");
const usersRouter = require("./routes/api/user");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/users", authRouter);
app.use("/api/contacts", router);
app.use("/api/user", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({ message: err.message });
});

module.exports = app;
