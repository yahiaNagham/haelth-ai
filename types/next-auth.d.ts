import NextAuth from "next-auth"

declare module "next-auth" {
  interface User{
    username: string;
    id: string;
    email: string;
    phone: string;
    role:string 
  }
  interface Session {
    user: User & {
      username: string,
      id:string
    }
    token:{
      username: string,
    }
  }
}