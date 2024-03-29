import { connect } from "../../../Config/dbConfig";
import Message from "../../../models/message.model";
import User from "../../../models/user.model";
import Chat from "../../../models/chat.model";
import { NextResponse, NextRequest } from "next/server";
import { pusherServer } from "../../../Config/pusher";

connect();

export async function POST(req) {
  try {
    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const newMessage = await new Message({
      chat: chatId,
      sender: currentUserId,
      text,
      photo,
      seenBy: currentUserId,
    });

    const msg = await newMessage.save();

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { message: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "message",
        model: "Message",
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    await pusherServer.trigger(chatId, "new-message", newMessage);

    return NextResponse.json({ success: true, data: msg }, { status: 201 });
  } catch (error) {
    console.log("Server error ", error.message);
    return NextResponse.json(
      {
        message: "Internal server error in getting message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
