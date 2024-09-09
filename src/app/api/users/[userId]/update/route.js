import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../../../Config/dbConfig";
import User from "../../../../../models/user.model";
import { dummyUserImg } from "../../../../../components";

connect();

export async function POST(req, { params }) {
  try {
    const { userId } = params;

    let { username, profilePic } = await req.json();

    console.log("profile pic", profilePic);

    if (!profilePic) profilePic = dummyUserImg;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: username.toLowerCase().trim(),
        profilePic,
      },
      { new: true }
    );

    return NextResponse.json({ user: user, success: true }, { status: 201 });
  } catch (error) {
    console.log("error in updating profile", error.message);
    return NextResponse.json(
      { success: false, error: error, message: "error in updating profile" },
      { status: 500 }
    );
  }
}
