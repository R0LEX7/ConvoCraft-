import { NextResponse, NextRequest } from "next/server";
import User from "../../../models/user.model";
import Chat from "../../../models/chat.model";
import { connect } from "../../../dbConfig/dbConfig";

connect();

export async function POST(req) {
  try {
    const body = await req.json();

    const { members, currentUserId, isGroup, name } = body;

    console.log(body);

    // define query to find chat

    const query = isGroup
      ? { isGroup, members: [currentUserId, ...members], name }
      : {
          members: { $all: [currentUserId, ...members], $size: 2 },
        };

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
    }

    return NextResponse.json(
      {
        success: true,
        data: chat,
      },
      { status: 200 }
    );
  } catch (error) {
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
