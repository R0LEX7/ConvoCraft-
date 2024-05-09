"use client";
import React, { useState, useEffect, useRef } from "react";
import { User, Card, Input } from "@nextui-org/react";
import { VscSend } from "react-icons/vsc";
import MessageBox from "./MessageBox"
import { aiAvatar } from "../index";

const Box = () => {
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  // handle message
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);

  const handleSubmit = (msg) => {
    setChat([...chat, { text: msg, id: Date.now(), byUser: false }]);
  };

  console.log("msgs -> ", chat);
  return (
    <div className="w-[95%] rounded-lg ">
      {/* chat header */}
      <Card className="h-[56px] flex justify-start  bg-[#27272A] px-2 lg:px-3 md:px-3">
        <User
          className="h-[56px] w-fit cursor-pointer"
          name="Convo - AI"
          avatarProps={{ src: aiAvatar }}
        />
      </Card>
      {/* message box */}
      <div>
        <div className="h-[450px] lg:h-[400px] md:h-[400px] py-1 overflow-x-hidden  overflow-y-scroll custom-scrollbar scrollbar-hide my-1">
        {chat &&
            chat?.map((message) => (
                <MessageBox message = {message}/>
            ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex bg-[#27272a] rounded-xl justify-center items-center">
          <Input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type your message here"
          />
          {message.trim().length > 0 ? (
            <div
              className="text-xl justify-center items-center flex w-14 h-14 p-2 mr-1 cursor-pointer hover:scale-125 ease-out hover:font-medium hover:text-secondary-400"
              onClick={(e) => {
                e.preventDefault();
                const text = message;
                handleSubmit(text);
                setMessage("");
              }}
            >
              <VscSend />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Box;
