const User = require("../models/User");
const {
  userRegisterValidator,
  userLoginValidator,
  assignmentUploadValidator,
} = require("../validators/user.validator");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const { validationResult, matchedData } = require("express-validator");
const { createSendToken } = require("../utils/jwtTokenHelper");
const Admin = require("../models/Admin");
const Assignment = require("../models/Assignment");

/****************
*  User register
*****************/
exports.register = catchAsync(async (req, res, next) => {
  await Promise.all(
    userRegisterValidator.map((validator) => validator.run(req))
  );
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const data = matchedData(req);

  const checkUserExists = await User.findOne({ userId: data.userId });
  if (checkUserExists) {
    return next(new AppError("User already exists", 409));
  }
  let userData = {
    userId: data.userId,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  };

  let user = await User.create(userData);

  createSendToken(user, 200, res);
});

/*************
*  User login
**************/
exports.login = catchAsync(async (req, res, next) => {
  await Promise.all(userLoginValidator.map((validator) => validator.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const data = matchedData(req);
  const user = await User.findOne({ userId: data.userId });
  if (!user) {
    return next(new AppError("Invalid user ID or password", 401));
  }
  let comparePassword = await bcrypt.compare(data.password, user.password);
  if (!user || !comparePassword)
    return next(new AppError("invalid user ID or password", 401));

  createSendToken(user, 200, res);
});

/************************
*  User upload assignment
*************************/
exports.upload = catchAsync(async (req, res, next) => {
  if (!req.user?._id)
    return next(new AppError("session expired please login", 401));

  await Promise.all(
    assignmentUploadValidator.map((validator) => validator.run(req))
  );
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const data = matchedData(req);

  let checkAdminId = await Admin.findOne({ adminId: data.adminId });
  if (!checkAdminId) return next(new AppError("Invalid admin id", 401));

  let assignmentData = {
    userId: req.user.userId,
    adminId: data.adminId,
    task: data.task,
  };

  let createAssignment = await Assignment.create(assignmentData);

  if (!createAssignment)
    return next(
      new AppError("Something went wrong while submit assignment", 401)
    );

  res.status(200).json({
    status: "success",
    data: createAssignment,
  });
});

/******************
*  User get admins
*******************/
exports.admins = catchAsync(async (req, res, next) => {
  if (!req.user?._id)
    return next(new AppError("session expired please login", 401));

  let admins = await Admin.find({}).select("adminId");

  if (!admins) return next(new AppError("admins not found", 404));
  res.status(200).json({
    stauts: "success",
    data: admins,
  });
});
