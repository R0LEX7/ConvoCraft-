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

    const currentUser = await User.findById(currentUserId);

    const newMessage = await new Message({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUser,
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

    console.log("updated chat msgs ", newMessage);

    {
      /* trigger real time messaging with a pusher event */
    }
    await pusherServer.trigger(chatId, "new-message", newMessage);

    const lastMessage = updatedChat.message[updatedChat.message.length - 1];

    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "updated-chat", {
          id: chatId,
          message: [lastMessage],
        });
      } catch (error) {
        console.log("Failed to trigger update-chat event ", error);
      }
    });

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
