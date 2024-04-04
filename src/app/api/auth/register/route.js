import { NextResponse, NextRequest as req } from "next/server";
import { connect } from "../../../../Config/dbConfig";
import { hash, genSalt } from "bcryptjs";
import isEmail from "validator/lib/isEmail";
import User from "../../../../models/user.model";
import myCache from "../../../../Config/nodeCache";

connect();

export async function POST(req) {
  try {
    const body = await req.json();

    let { username, email, password } = body;



    console.log("body -> ", body);

    if (!username && !email && !password)
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 404 }
      );

    /* email validation  */

    if (!isEmail(email)) {
      return NextResponse.json(
        {
          error: "Invalid email address",
          success: false,
        },
        { status: 400 }
      );
    }

    /* is user already exists ?  */

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 400 }
      );
    }

    /* password hashing  */
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    /* stores and save the user in database */

    const newUser = new User({
      email : email.toLowerCase().trim(),
      username : username.toLowerCase().trim(),
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    console.log("Alert new user ", savedUser);
     await myCache.del("allUsers");
    return NextResponse.json(
      { success: true, message: "Login successfully ", data: savedUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
