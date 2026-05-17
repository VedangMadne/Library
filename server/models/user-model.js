import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Student", "Admin", "Teacher"],
    },
    accountStatus: {
      type: String,
      default: "Active",
      enum: ["Active", "Disabled"],
    },

    resetToken: {
      type: String,
      default: "",
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    class: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
    },
    division: {
      type: mongoose.Schema.ObjectId,
      ref: "Division",
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
