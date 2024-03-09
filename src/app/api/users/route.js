import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../dbConfig/dbConfig";
import User from "../../../models/user.model";
import myCache from "../../../dbConfig/nodeCache";

connect();

export async function GET(req) {
  try {
    let allUsers = myCache.get("allUsers");
    let isCache = true;

    if (!allUsers) {
      isCache = false;
      console.log("no cache");
      allUsers = await User.find();
    }

    console.log(myCache);
    myCache.set("allUsers", allUsers);
    return NextResponse.json(
      {
        isCache,
        message: "all users",
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
