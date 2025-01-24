const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {

  const token = req.headers.authorization;
  if (token) {
    const decoded = await jwt.verify(token, "pandal");
    if (decoded) {
      const userID = decoded.userID;
      req.body.userID = userID;
      next();
    } else {
      res.status(400).send({ msg: "please login" });
    }
  } else {
    res.status(400).send({ msg: "please login" });
  }
};

module.exports = auth
