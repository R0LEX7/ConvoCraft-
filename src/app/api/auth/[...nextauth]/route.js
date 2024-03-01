import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
<<<<<<< HEAD
import {connect} from "../../../../dbConfig/dbConfig"
import User from "../../../../models/user.model"


connect()


=======

// mongo connection
// user modal
>>>>>>> 46f8a00227de28388c76e6a608e52449a4056b88

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid email or password");
        }
        // await connection()dbconnection

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordMatched = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatched) throw new Error("Password dont match");

        return user;
      },
    }),
  ],

  secret: "secret key",

  callbacks:{
    async session({session}){
<<<<<<< HEAD
        const user = await User.findOne({email : session.user.email})
=======
        const user = await User.findOne({session.user.email})
>>>>>>> 46f8a00227de28388c76e6a608e52449a4056b88
        session.user.id = user._id.toString();

        session.user = {...session.user , ...user._doc}
        return session
    }
  }
});

export {handler as GET , handler as POST}
