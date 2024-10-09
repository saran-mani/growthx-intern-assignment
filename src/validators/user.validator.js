const { body } = require("express-validator");

/********************************
*  User register data validation
*********************************/
const userRegisterValidator = [
  body("userId").notEmpty().withMessage("Please provide an user ID"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm password does not match the password!");
    }
    return true;
  }),
];

/********************************
*  User login data validation
*********************************/
const userLoginValidator = [
  body("userId").notEmpty().withMessage("Please provide an user ID"),
  body("password").notEmpty().withMessage("Please provide a password"),
];

/***************************************
*  User assignment upload data validation
****************************************/
const assignmentUploadValidator = [
  body("adminId").notEmpty().withMessage("Please provide an admin ID"),
  body("task")
    .notEmpty()
    .withMessage("Please provide a valid task information"),
];

module.exports = {
  userRegisterValidator,
  userLoginValidator,
  assignmentUploadValidator,
};
