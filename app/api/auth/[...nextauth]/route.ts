import NextAuth, { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb";
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async session({ session, token, user }) {
      if (session.user !== undefined) {
        const sessionUser = await User.findOne({
          email: session.user.email
        })
        
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        await connectToDB();
        
        const userExists = await User.findOne({
          email: profile?.email
        });

        if (!userExists) {
          await User.create({
            email: profile?.email,
            username: profile?.name?.replace(" ", "").toLowerCase(),
            image: profile?.picture

          })
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

const AuthRoute = NextAuth(options);
export { AuthRoute as GET, AuthRoute as POST}
