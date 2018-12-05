let express = require("express");
let jwt = require("express-jwt");
let EventCtrl = require('../controllers/event');
let config = require('../config');

let eventRouter = express.Router();

module.exports = app => {
  eventRouter.get("/", jwt({secret: config.jwt.secret, credentialsRequired: true}), EventCtrl.search);
  eventRouter.get("/report", jwt({secret: config.jwt.secret, credentialsRequired: true}), EventCtrl.getReport);

  app.use("/events", eventRouter);
};
