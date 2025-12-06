export interface User {
  _id: string;
  name: string;
  username: string;
  role: "admin" | "user";
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}
