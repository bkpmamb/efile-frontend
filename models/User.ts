import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  password: string;
  role: "admin" | "user";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // penting unique
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
