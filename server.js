const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let admin = { login: "admin", password: "1234" };

// регистрация
app.post("/register", (req, res) => {
  const { nick, email } = req.body;

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const user = {
    nick,
    email,
    ip,
    date: new Date().toLocaleString(),
    banned: false
  };

  users.push(user);

  res.json({ success: true });
});

// логин админа
app.post("/admin/login", (req, res) => {
  const { login, password } = req.body;

  if (login === admin.login && password === admin.password) {
    return res.json({ token: "ok" });
  }

  res.json({ error: "wrong" });
});

// список игроков
app.get("/admin/users", (req, res) => {
  if (req.headers.authorization !== "ok") {
    return res.status(401).send("no");
  }

  res.json(users);
});

// бан
app.post("/admin/ban", (req, res) => {
  const { email } = req.body;

  const user = users.find(u => u.email === email);
  if (user) user.banned = true;

  res.json({ success: true });
});

app.listen(3000, () => console.log("SERVER WORKING 🔥"));