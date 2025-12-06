import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    username: string;
    role: "admin" | "user";
  }

  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      role: "admin" | "user";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    username: string;
    role: "admin" | "user";
    loginTime?: number;
  }
}
