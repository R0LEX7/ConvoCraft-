import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../Config/dbConfig";
import User from "../../../models/user.model";
import myCache from "../../../Config/nodeCache";

connect();

export async function GET(req) {
  try {
    let allUsers = await myCache.get("allUsers");
    let isCache = true;

    if (!allUsers) {
      isCache = false;
      console.log("no cache");
      allUsers = await User.find();
      await myCache.set("allUsers", JSON.stringify(allUsers), 600);
    }

    let parsedData = null;
    if (allUsers) {
      try {
        parsedData = JSON.parse(allUsers);
      } catch (error) {
        console.error("Error parsing cached data:", error);
      }
    }

    return NextResponse.json(
      {
        isCache,
        message: "all users",
        success: true,
        data: parsedData,
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
