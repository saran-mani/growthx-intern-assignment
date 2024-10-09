const express = require("express");
const {
  register,
  login,
  assignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/Admin");
const { adminProtect } = require("../controllers/Auth");

const router = express.Router();

/***************
*  Admin Routes
****************/
router.route("/register").post(register);
router.route("/login").post(login);
router.use(adminProtect) // protect routes  with adminProtect middleware
router.route("/assignments").get(assignments);
router.route("/assignments/:id/accept").post(acceptAssignment);
router.route("/assignments/:id/reject").post(rejectAssignment);

module.exports = router;
