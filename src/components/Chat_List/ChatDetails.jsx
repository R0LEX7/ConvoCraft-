"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, User, Card, CardBody, Input } from "@nextui-org/react";
import { dummyGrpImg, dummyUserImg } from "../index";
import { VscSend } from "react-icons/vsc";
import MessageBox from "./MessageBox";
import { CldUploadButton } from "next-cloudinary";
import { BiImageAdd } from "react-icons/bi";

const getChatDetails = async (chatId) => {
  const response = await fetch(`/api/chat/${chatId}`);
  const data = await response.json();
  console.log(data?.data);
  return data?.data;
};

const ChatDetails = ({ chatId, currentUser }) => {
  const [otherMembers, setOtherMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState("");
  console.log("current user ",currentUser )

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chatDetails"],
    queryFn: () => getChatDetails(chatId),
  });

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
      if (response.ok) console.log(" pic ", result?.info?.secure_url);
    } catch (error) {
      console.log("error ", error);
    }
  };

  useEffect(() => {
    if (data)
      setOtherMembers(
        data?.members.filter((member) => member._id !== currentUser?._id)
      );
  }, [data, currentUser]);

  // handle message
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("message ", message);
    if (message.trim().length > 0) {
      sendMessage();
    }
  };

  return (
    <div className="w-[95%] rounded-lg ">
      {/* chat header */}
      <Card className="h-[56px] flex justify-start  bg-[#27272A] px-2 lg:px-3 md:px-3">
        {data?.isGroup ? (
          <User
            className="h-[56px] w-fit"
            name={data.name.length > 0 ? data.name : "Group name"}
            avatarProps={{
              src: data.groupPhoto.length > 0 ? data.groupPhoto : dummyGrpImg,
            }}
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
        <div className="h-[400px] py-1">
          {data?.message.map((message) => (
            <MessageBox
              message={message}
              key={message._id}
              currentUser={currentUser}
            />
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex bg-[#27272a] rounded-xl justify-center items-center"
        >
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={sendPhoto}
            uploadPreset="tzwbyyhp"
          >
            <span className="text-xl justify-center items-center flex w-14 h-14 p-2 mr-1">
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
              className="text-xl justify-center items-center flex w-14 h-14 p-2 mr-1"
              onClick={handleSubmit}
            >
              <VscSend />
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default ChatDetails;
