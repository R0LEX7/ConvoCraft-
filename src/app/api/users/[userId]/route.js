import { NextResponse, NextRequest } from "next/server";
import User from "../../../../models/user.model";
import Chat from "../../../../models/chat.model";
import { connect } from "../../../../Config/dbConfig";
import Message from "../../../../models/message.model";

connect();

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    let allChats;

    let isCache = true;

    if (!allChats) {
      allChats = await Chat.find({ members: userId })
        .populate({
          path: "members",
          model: User,
        })
        .populate({
          path: "message",
          model: Message,
          populate: { path: "seenBy sender", User },
        })
        .sort({ lastMessageAt: -1 });
      isCache = false;
    }

    return NextResponse.json(
      {
        isCache,
        success: true,
        data: isCache ? JSON.parse(allChats) : allChats,
        message: "all chats ",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "unable to find chats from server",
      },
      { status: 500 }
    );
  }
}
