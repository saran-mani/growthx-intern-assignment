const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/****************
*  User  Model
*****************/
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
  },

  {
    timestamps: true,
  }
);

/****************************************
*  Hash password before  saving(security)
*****************************************/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const password = this.password;
  this.password = await bcrypt.hash(password, 12);
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
