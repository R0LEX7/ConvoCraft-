import React from "react";
import { useRouter } from "next/navigation";
import { User } from "@nextui-org/react";

const dummyGrpImg = "https://irb.utah.edu/_resources/images/people2.JPG";
const dummyUserImg =
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?w=740&t=st=1709367527~exp=1709368127~hmac=dd7a0631f0abf18a02f2d6505aeee3a915f5edfca5a7f8a38796370fc54bf777";

const ChatBox = ({ chat, currentUser }) => {
  const otherMembers = chat?.members.filter(
    (member) => member._id !== currentUser._id
  );
  return (
    <div className=" my-2 border-b-1 border-[#18181B] p-2">
      {chat.isGroup ? (
        <User
          name={chat?.name}
          description="Product Designer"
          avatarProps={{
            src: chat.groupPhoto === "" ? dummyGrpImg : chat.groupPhoto,
          }}
        />
      ) : (
        <User
          name={otherMembers[0]?.username}
          description="Product Designer"
          avatarProps={{
            src: otherMembers[0]?.profilePic === "" ? dummyUserImg : chat.profilePic,
          }}
        />
      )}
    </div>
  );
};

export default ChatBox;
