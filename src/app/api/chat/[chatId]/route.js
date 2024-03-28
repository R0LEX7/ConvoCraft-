import { NextResponse, NextRequest } from "next/server";
import { connect } from "../../../../dbConfig/dbConfig";
import User from "../../../../models/user.model";
import Chat from "../../../../models/chat.model";
import Message from "../../../../models/message.model";

export async function GET(req, { params }) {
  try {
    const { chatId } = params;
    const chat = await Chat.findById(chatId)
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "message",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
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

export async function POST(req, { params }) {
  try {
    const { chatId } = params;
    const { currentUserId } = await req.json();

    await Message.updateMany(
      { chat: chatId },
      {
        $addToSet: { seenBy: currentUserId },
      },
      { new: true }
    ).populate({
      path: "seenBy sender",
      model: User,
    });
    return NextResponse.json({message : "seen all msgs by currentUser"},{status : 200})
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
