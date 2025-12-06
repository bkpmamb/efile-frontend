import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function verifyUser(username: string, password: string) {
  const user = await User.findOne({ username }).lean();
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return user;
}
