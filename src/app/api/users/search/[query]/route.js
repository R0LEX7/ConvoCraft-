import {NextResponse , NextRequest} from "next/server";
import { connect } from "../../../../../Config/dbConfig";
import User from "../../../../../models/user.model";

connect();


export async function GET(req,{params}){

  try{
      const {query} = params;

    const searchedUsers = await User.find({
      $or : [
        {username : {$regex : query , $options: "i"}},
      {email : {$regex : query , $options: "i"}}

        ]
    }).populate({
      path: "members",
      model: User,
    })
    .populate({
      path: "message",
      model: Message,
      populate: { path: "seenBy sender", User },
    });
    return NextResponse.json({success: true , data : searchedUsers},{status:200})
  }catch(error){
    console.log("error " , error);
    return NextResponse.json({success: false , },{status:500})
  }
}
