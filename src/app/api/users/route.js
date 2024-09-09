import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../Config/dbConfig";
import User from "../../../models/user.model";

connect();

export async function GET(req) {
  try {
    let allUsers = await User.find();

    return NextResponse.json(
      {
        message: "all users",
        success: true,
        data: allUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error ", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
