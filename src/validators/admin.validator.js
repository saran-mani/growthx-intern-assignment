const { body } = require("express-validator");

/********************************
*  Admin register data validation
*********************************/
const adminRegisterValidator = [
  body("adminId").notEmpty().withMessage("Please provide an admin ID"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("passwordConfirm")
    .if(body("adminId").exists())
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm password does not match the password!");
      }
      return true;
    }),
];

/********************************
*  Admin login data validation
*********************************/
const adminLoginValidator = [
  body("adminId").notEmpty().withMessage("Please provide an admin ID"),
  body("password").notEmpty().withMessage("Please provide a password"),
];

module.exports = { adminRegisterValidator, adminLoginValidator };
