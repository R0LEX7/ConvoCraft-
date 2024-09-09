import { NextResponse, NextRequest } from "next/server";
import User from "../../../models/user.model";
import Chat from "../../../models/chat.model";
import { connect } from "../../../Config/dbConfig";
import { pusherServer } from "../../../Config/pusher";

connect();

export async function POST(req) {
  try {
    const body = await req.json();

    const { members, currentUserId, isGroup, name } = body;

    const query = isGroup
      ? { isGroup, members: [currentUserId, ...members], name }
      : {
          members: { $all: [currentUserId, ...members], $size: 2 },
        };

    console.log("query", query);
    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );
      await chat.save();

      const updateAllMembers = chat.members.map(async (member) => {
        await User.findByIdAndUpdate(
          member._id,
          {
            $addToSet: { chat: chat._id },
          },
          { new: true }
        );
      });

      Promise.all(updateAllMembers);

      {
        /* trigger event for new chat */
      }

      chat.members.map(async (member) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: chat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "error in creating chat",
      },
      { status: 500 }
    );
  }
}
