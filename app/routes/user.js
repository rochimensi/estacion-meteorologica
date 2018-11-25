let express = require("express");
let UserCtrl = require('../controllers/user');

let authRouter = express.Router();
let usersRouter = express.Router();

module.exports = app => {
  authRouter.post("/login", UserCtrl.login);

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);
};
