import mongoose from "mongoose";
import { dummyUserImg } from "../components/index";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    profilePic: {
      type: String,
      default: dummyUserImg,
    },
    chat: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
