let jwt = require("jsonwebtoken");

let role = (adminOnly) => {
  return async function (req, res, next) {
    if(!adminOnly) {
      await next();
      return;
    }

    const user = jwt.decode(req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (user.isAdmin === adminOnly) {
        await next();
        return;
    } else {
      throw(403);
    }
  };
};

module.exports = {role};
