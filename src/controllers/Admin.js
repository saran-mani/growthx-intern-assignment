const Admin = require("../models/Admin");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const {
  adminRegisterValidator,
  adminLoginValidator,
} = require("../validators/admin.validator");
const catchAsync = require("../utils/catchAsync");
const { validationResult, matchedData } = require("express-validator");
const { createSendToken, verifyToken } = require("../utils/jwtTokenHelper");
const Assignment = require("../models/Assignment");

/*******************
*  Admin register
*******************/
exports.register = catchAsync(async (req, res, next) => {
  await Promise.all(
    adminRegisterValidator.map((validator) => validator.run(req))
  );
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const data = matchedData(req);

  const checkAdminExists = await Admin.findOne({ adminId: data.adminId });
  if (checkAdminExists) {
    return next(new AppError("Admin already exists", 409));
  }
  let adminData = {
    adminId: data.adminId,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  };

  let admin = await Admin.create(adminData);

  createSendToken(admin, 200, res);
});

/*******************
*  Admin login
*******************/
exports.login = catchAsync(async (req, res, next) => {
  await Promise.all(adminLoginValidator.map((validator) => validator.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const data = matchedData(req);
  const admin = await Admin.findOne({ adminId: data.adminId });
  if (!admin) {
    return next(new AppError("Invalid admin ID or password", 401));
  }
  let comparePassword = await bcrypt.compare(data.password, admin.password);
  if (!admin || !comparePassword)
    return next(new AppError("invalid admin ID or password", 401));

  createSendToken(admin, 200, res);
});

/******************************
*  Admin get tagged assignments
*******************************/
exports.assignments = catchAsync(async (req, res, next) => {
  if (!req.user?._id)
    return next(new AppError("session expired please login", 401));

  let adminId = req.user.adminId;
  let assignments = await Assignment.find({ adminId: adminId }).select("-__v");


  res.status(200).json({
    status: "success",
    data: assignments,
  });
});


/*********************************
*  Admin Accept tagged assignment
**********************************/
exports.acceptAssignment = catchAsync(async (req, res, next) => {
  if (!req.user?._id)
    return next(new AppError("session expired please login", 401));

  let assignmentId = req.params.id;
  let adminId = req.user.adminId;
  let assignment = await Assignment.findById(assignmentId);

  if (!(adminId === assignment.adminId)) {
    return next(new AppError("You are not the admin of this assignment", 403));
  }

  if (assignment.isAccepted) {
    return next(new AppError("Assignment is already accepted", 403));
  }

  assignment.isAccepted = true;
  assignment.save();

  res.status(200).json({
    status: "success",
    data: assignment,
  });
});

/*********************************
*  Admin Reject tagged assignment
**********************************/
exports.rejectAssignment = catchAsync(async (req, res, next) => {
  if (!req.user?._id)
    return next(new AppError("session expired please login", 401));

  let assignmentId = req.params.id;
  let adminId = req.user.adminId;
  let assignment = await Assignment.findById(assignmentId);

  if (!(adminId === assignment.adminId)) {
    return next(new AppError("You are not the admin of this assignment", 403));
  }
  assignment.isAccepted = false;
  assignment.save();

  res.status(200).json({
    status: "success",
    data: assignment,
  });
});
