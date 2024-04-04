"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Card,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { dummyGrpImg, dummyUserImg } from "../index";
import { VscSend } from "react-icons/vsc";
import MessageBox from "./MessageBox";
import { CldUploadButton } from "next-cloudinary";
import { BiImageAdd } from "react-icons/bi";
import { pusherClient } from "../../Config/pusher.js";
import GroupDetails from "./GroupDetails";

const getChatDetails = async (chatId) => {
  const response = await fetch(`/api/chat/${chatId}`);
  const data = await response.json();

  return data?.data;
};

const ChatDetails = ({ chatId, currentUser }) => {
  const [otherMembers, setOtherMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chatDetails"],
    queryFn: () => getChatDetails(chatId),
  });

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.message]);

  const sendMessage = async () => {
    try {
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          currentUserId: currentUser._id,
          chatId,
          photo: "",
        }),
      });
      if (response.ok) setMessage("");
    } catch (error) {
      console.log("error ", error);
    }
  };
  const sendPhoto = async (result) => {
    try {
      const response = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "",
          currentUserId: currentUser._id,
          chatId,
          photo: result?.info?.secure_url,
        }),
      });
      if (response.ok) {
        console.log(" pic ", result?.info?.secure_url);

        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    if (data) {
      setChat(data);
      setOtherMembers(
        data?.members.filter((member) => member._id !== currentUser?._id)
      );
    }
  }, [data, currentUser]);

  // handle message
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim().length > 0) {
      sendMessage();
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);
    const handleMsg = async (newMsg) => {
      setChat((prvChat) => {
        return {
          ...prvChat,
          message: [...prvChat.message, newMsg],
        };
      });
    };

    pusherClient.bind("new-message", handleMsg);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMsg);
    };
  }, [chatId]);

  return (
    <div className="w-[95%] rounded-lg ">
      {/* chat header */}
      <Card className="h-[56px] flex justify-start  bg-[#27272A] px-2 lg:px-3 md:px-3">
        {chat?.isGroup ? (
          <User
            className="h-[56px] w-fit cursor-pointer"
            name={chat.name.length > 0 ? chat.name : "Group name"}
            avatarProps={{
              src: chat.groupPhoto.length > 0 ? chat.groupPhoto : dummyGrpImg,
            }}
            onClick={onOpen}
          />
        ) : (
          <User
            className="h-[56px] w-fit"
            name={otherMembers[0]?.username ? otherMembers[0]?.username : ""}
            avatarProps={{
              src:
                otherMembers[0]?.profilePic.length > 0
                  ? otherMembers[0]?.profilePic
                  : dummyUserImg,
            }}
          />
        )}
      </Card>
      {/* message box */}
      <div>
        <div className="h-[450px] lg:h-[400px] md:h-[400px] py-1 overflow-x-hidden  overflow-y-scroll custom-scrollbar scrollbar-hide my-1">
          {chat &&
            chat?.message.map((message) => (
              <MessageBox
                message={message}
                key={message._id}
                currentUser={currentUser}
                isGroup={chat?.isGroup}
              />
            ))}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex bg-[#27272a] rounded-xl justify-center items-center"
        >
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={(result) => sendPhoto(result)}
            uploadPreset="tzwbyyhp"
          >
            <span className="text-xl justify-center items-center flex w-14 h-14 p-2 cursor-pointer hover:scale-125 ease-out hover:font-medium hover:text-secondary-400">
              <BiImageAdd />
            </span>
          </CldUploadButton>
          <Input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type your message here"
            // placeholder="Enter your Message"
          />
          {message.trim().length > 0 ? (
            <div
              className="text-xl justify-center items-center flex w-14 h-14 p-2 mr-1 cursor-pointer hover:scale-125 ease-out hover:font-medium hover:text-secondary-400"
              onClick={handleSubmit}
            >
              <VscSend />
            </div>
          ) : null}
        </form>
      </div>

      <Modal
        backdrop="blur"
        size="xs"
        placement="center"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className="text-black">
          {(onClose) => <GroupDetails chat={chat} onClose={onClose} />}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChatDetails;
