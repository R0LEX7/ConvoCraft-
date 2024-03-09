import { NextResponse, NextRequest } from "next/server";
import User from "../../../../models/user.model";
import Chat from "../../../../models/chat.model";
import { connect } from "../../../../dbConfig/dbConfig";
import myCache from "../../../../dbConfig/nodeCache";

connect();

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    let allChats = myCache.get(`${userId}chats`);

    let isCache = true;

    if (!allChats) {
      allChats = await Chat.find({ members: userId }).populate({
        path: "members",
        model: User,
      });
      isCache = false;
    }
    myCache.set(`${userId}chats`, allChats);
    return NextResponse.json(
      {
        isCache,
        success: true,
        data: allChats,
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
