import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { User } from "@nextui-org/react";

const dummyGrpImg = "https://irb.utah.edu/_resources/images/people2.JPG";
const dummyUserImg =
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=740&t=st=1709367527~exp=1709368127~hmac=dd7a0631f0abf18a02f2d6505aeee3a915f5edfca5a7f8a38796370fc54bf777";

const getChatDetails = async (chatId) => {
  const response = await fetch(`/api/chat/${chatId}`);
  const data = await response.json();

  return data?.data;
};

const ChatBox = ({ chat, currentUser, currentChatId }) => {
  const [desc, setDesc] = useState({ text: "", time: "" });
  const router = useRouter();
  const otherMembers = chat?.members.filter(
    (member) => member._id !== currentUser._id
  );

  let isSelectedChat = false;

  const lastMessage =
    chat?.message.length > 0 && chat?.message[chat?.message.length - 1];

  const seen = lastMessage?.seenBy?.find(
    (member) => member._id === currentUser?.id
  );

  if (lastMessage) {
    desc.text = lastMessage?.photo ? "Photo" : lastMessage?.text;
    desc.time = chat?.lastMessageAt;
  } else {
    desc.text = "Send a message";
    desc.time = chat?.createdAt;
  }

  if (currentChatId === chat._id) isSelectedChat = true;

  return (
    <div
      className={` rounded-xl cursor-pointer border-[#18181B] p-2 ${
        isSelectedChat && "bg-secondary-200"
      }`}
      onClick={() => router.push(`/chats/${chat._id}`)}
    >
      {chat.isGroup ? (
        <User
          name={chat?.name}
          description={desc.text}
          avatarProps={{
            src: chat.groupPhoto === "" ? dummyGrpImg : chat.groupPhoto,
          }}
          classNames={{
            description: `${seen?._id !== currentUser?.id && "text-white"}`,
          }}
        />
      ) : (
        <User
          name={otherMembers[0]?.username}
          description={`${desc.text}       ${format(new Date(desc.time), "p")}`}
          avatarProps={{
            src:
              otherMembers[0]?.profilePic === ""
                ? dummyUserImg
                : chat.profilePic,
          }}
          classNames={{
            description: `${seen?._id !== currentUser?.id && "text-white"}`,
          }}
        />
      )}
    </div>
  );
};

export default ChatBox;
