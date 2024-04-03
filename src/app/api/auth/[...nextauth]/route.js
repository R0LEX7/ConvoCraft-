import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connect } from "../../../../Config/dbConfig";
import User from "../../../../models/user.model";

connect();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }


        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordMatched = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatched) throw new Error("Password don`t match");

        return user;
      },
    }),
  ],

  pages: {
    signIn: '/'
  },
  secret: "secret key",

  callbacks: {
    async session({ session }) {
      const user = await User.findOne({ email: session.user.email });

      session.user.id = user._id.toString();

      session.user = { ...session.user, ...user._doc };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
