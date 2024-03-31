"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChatList } from "../../../../components/index";
import ChatDetails from '../../../../components/Chat_List/ChatDetails'

const seenFunction = async (currentUserId, chatId) => {
  try {
    const response = await fetch(`/api/chat/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUserId: currentUserId,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("error ", error);
  }
};

const page = () => {
  const { chatId } = useParams();
  const { data: session } = useSession();
  const currentUser = session?.user;

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && chatId) {
        try {
          const data = await seenFunction(currentUser._id, chatId);

        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      }
    };

    fetchData();
  }, [currentUser, chatId]);

  return (
    <div className="lg:px-10 pt-6 lg:mb-8 flex justify-center items-start px-2 h-fit ">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-full flex justify-center">
        <ChatDetails chatId={chatId} currentUser={session?.user} />
      </div>
    </div>
  );
};

export default page;
