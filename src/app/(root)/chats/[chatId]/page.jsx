"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChatList, ChatDetails } from "../../../../components/index";

const page = () => {
  const { chatId } = useParams();
  const { data: session } = useSession();

  return (
    <div className="lg:px-10 pt-6 lg:mb-20 flex justify-center items-start px-2 ">
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
