const Admin = require("../models/Admin");
const User = require("../models/User");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwtTokenHelper");

/************************************
*  Protect API Routes only for  user
*************************************/
exports.userProtect = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please login and try again", 401));
  }

  const decoded = verifyToken(token);

  const currentUser = await User.findOne({ _id: decoded.id });
  if (!currentUser) {
    return next(new AppError("jwt token expired or invalid", 401));
  }

  req.user = currentUser;
  next();
};

/************************************
*  Protect API Routes only for  Admin
*************************************/
exports.adminProtect = async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Please login and try again", 401));
  }

  const decoded = verifyToken(token);

  const currentUser = await Admin.findOne({ _id: decoded.id });
  if (!currentUser) {
    return next(new AppError("jwt token expired or invalid", 401));
  }

  req.user = currentUser;
  next();
};
