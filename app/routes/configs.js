let express = require("express");
let jwt = require("express-jwt");
let config = require("../config");
let ConfigsCtrl = require("../controllers/configs");
let {role} = require("../middleware/role");

let configsRouter = express.Router();

module.exports = app => {

  configsRouter.get("/alerts",  jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.setAlerts);

  configsRouter.get("/alerts-email",  jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.setEmail);

  configsRouter.get("/umbrales-temperatura",  jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.setTempUmbrales);
  configsRouter.get("/umbrales-viento",  jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.setVientoUmbrales);
  configsRouter.get("/umbrales-humedad",  jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), ConfigsCtrl.setHumedadUmbrales);
  configsRouter.get("/transferencia-temperatura",   jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.setTempFuncion(req, res, app);
  });
  configsRouter.get("/transferencia-viento",   jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.setVientoFuncion(req, res, app);
  });
  configsRouter.get("/transferencia-humedad",   jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.setHumedadFuncion(req, res, app);
  });
  configsRouter.get("/delay",   jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.changeDelay(req, res, app);
  });
  configsRouter.get("/led",    jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.setLed(req, res, app);
  });
  configsRouter.get("/led-time",    jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.setLedTime(req, res, app);
  });
  configsRouter.get("/scan",    jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.getScan(req, res, app);
  });
  configsRouter.get("/status",  jwt({secret: config.jwt.secret, credentialsRequired: true}), role(true), (req, res) => {
    ConfigsCtrl.getIden(req, res, app);
  });

  app.use("/configs", configsRouter);
};
