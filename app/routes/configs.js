let express = require("express");
let jwt = require("express-jwt");
let config = require("../config");
let ConfigsCtrl = require("../controllers/configs");
let {role} = require("../middleware/role");

let configsRouter = express.Router();

module.exports = app => {

  configsRouter.put("/baudios", jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.changeChannel);
  configsRouter.put("/canal",   jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.changeChannel);
  configsRouter.put("/delay",   jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.changeDelay);
  configsRouter.get("/scan",    jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.getScan(req, res, app);
  });

  app.use("/configs", configsRouter);
};
