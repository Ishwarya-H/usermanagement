const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
    },

    groupAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    groupAdminName: {
      type: String,
      required: true,
    },
    isActive: {
  type: Boolean,
  default: true,
},
    memberCount: {
      type: Number,
      default: 1,
    },
memberLimit: {
  type: Number,
  default: 0,
},
allowJoinRequests: {
  type: Boolean,
  default: true,
}
  },
 
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Group",
  groupSchema
);