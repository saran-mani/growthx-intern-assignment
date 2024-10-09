const jwt = require("jsonwebtoken");

const signToken = (id) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.createSendToken = (user, statusCode, res) => {
  const id = user._id?.toString();
  const token = signToken(id ? id : "");

  const newUser = {
    userId: user.userId,
    _id: user._id,
  };

  res.status(statusCode).send({
    status: "success",
    data: {
      user: newUser,
      token: token,
    },
  });
};

exports.verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};
