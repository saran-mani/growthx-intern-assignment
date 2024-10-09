const mongoose = require("mongoose");

/****************
*  Assignment  Model
*****************/
const assignmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
