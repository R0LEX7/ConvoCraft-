import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/user.model";
import Chat from "../../../../models/chat.model";

export async function GET(req, { params }) {
  try {
    const { chatId } = params;
    const chat = await Chat.findById(chatId).populate({
      path: "members",
      model: User,
    }).populate({
      path: "message",
      model: "Message"
    });
    return NextResponse.json({ success: true, data: chat }, { status: 200 });
  } catch (error) {
    console.log("error in getting chat details ", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "error in getting chat details ",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
