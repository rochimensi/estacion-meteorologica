let config = require('../config');
let jwt = require("jsonwebtoken");

class UserController {

  async login(req, res) {
    if(req.body.email === config.users.admin && req.body.password === config.users.adminPassword) {
      let token = jwt.sign({isAdmin: true}, config.jwt.secret);
      res.status(200).send({token: token, isAdmin: true});
    } else if(req.body.email === config.users.user && req.body.password === config.users.userPassword){
      let token = jwt.sign({isAdmin: false}, config.jwt.secret);
      res.status(200).send({token: token, isAdmin: false});
    } else {
      res.status(401).send("Credenciales Invalidas");
    }
  }
}

let singleton = new UserController();

module.exports = singleton;
