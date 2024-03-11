import { NextResponse, NextRequest } from "next/server";
import User from "../../../../../../models/user.model";
import Chat from "../../../../../../models/chat.model";
import { connect } from "../../../../../../dbConfig/dbConfig";

connect();

export async function GET(req, { params }) {
  try {
    const { userId, query } = params;

    const searchedChat = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    });

    return NextResponse.json({ success: true, data: searchedChat });
  } catch (error) {
    console.log("error in searching", error);
    return NextResponse.json(
      {
        success: false,
        message: "error in searching",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
