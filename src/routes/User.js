const express = require("express");
const { register, login, upload, admins } = require("../controllers/User");
const router = express.Router();
const { userProtect } = require("../controllers/Auth");

/***************
*  User Routes
****************/
router.route("/register").post(register);
router.route("/login").post(login);
router.use(userProtect);// protect routes  with userProtect middleware
router.route("/upload").post(upload);
router.route("/admins").get(admins);

module.exports = router;
