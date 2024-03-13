import { NextResponse, NextRequest } from "next/server";
import User from "../../../../../../models/user.model";
import Chat from "../../../../../../models/chat.model";
import { connect } from "../../../../../../dbConfig/dbConfig";

connect();

export async function GET(req, { params }) {
  try {
    const { userId, query } = params;

    const searchedChat = await Chat.find({
      members: { $in: [userId] },
    }).populate({
      path: "members",
      model: User,
    });

    const byName = searchedChat.filter((chat) =>
      chat.name.includes(query.toLowerCase())
    );

    const byUserName = searchedChat.filter((chat) =>
    chat.members.some((member) =>
      member.username.toLowerCase().includes(query.toLowerCase())
    )
  );


    const data = [...byName, ...byUserName];

    return NextResponse.json({
      success: true,
      data: data,
    });
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
