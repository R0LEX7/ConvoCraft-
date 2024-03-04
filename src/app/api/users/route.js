import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../models/user.model";

connect();

export async function GET(req) {
  try {
    const allUsers = await User.find();

    return NextResponse.json(
      {
        success: true,
        data: allUsers,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
