"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Card,
  Input,
  Modal,
  ModalContent,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { VscSend } from "react-icons/vsc";
import MessageBox from "./MessageBox";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { aiAvatar } from "../index";

const Box = () => {
  const [message, setMessage] = useState("");

  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const [chat, setChat] = useState([]);

  const { onOpenChange } = useDisclosure();

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
    setChat([...chat, { text: msg, id: Date.now(), byUser: true }]);
  };

  console.log("");

  async function generateAnswer(e, text) {
    e.preventDefault();
    if (!generatingAnswer) {
      setGeneratingAnswer(true);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_AI_API_URI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: text }] }],
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const ans = data?.candidates[0]?.content?.parts[0]?.text;
        console.log("answer ", ans);
        setChat((prevChat) => [
          ...prevChat,
          {
            text: ans,
            id: Date.now(),
            byUser: false,
          },
        ]);
      } catch (error) {
        console.log(error);
      }

      setGeneratingAnswer(false);
    }
  }

  return (
    <div className="w-[95%] rounded-lg ">
      {/* chat header */}
      <Card className="h-[56px] flex justify-between flex-row  bg-[#27272A] px-2 lg:px-3 md:px-3">
        <User
          className="h-[56px] w-fit cursor-pointer"
          name="Convo - AI"
          avatarProps={{ src: aiAvatar }}
        />
        <div
          className="text-xl justify-center items-center flex w-14 h-14 p-2 mr-1 cursor-pointer hover:scale-125 ease-out hover:font-medium hover:text-secondary-400"
          onClick={() => setChat([])}
        >
          <MdOutlineDeleteOutline />
        </div>
      </Card>
      {/* message box */}
      <div>
        <div className="h-[450px] lg:h-[400px] md:h-[400px] py-1 overflow-x-hidden  overflow-y-scroll custom-scrollbar scrollbar-hide my-1">
          {chat &&
            chat?.map((message) => (
              <MessageBox message={message} key={message.id} />
            ))}
          <div ref={bottomRef} />
        </div>
        <form
          className="flex bg-[#27272a] rounded-xl justify-center items-center"
          onSubmit={(e) => {
            e.preventDefault();
            const text = message;
            handleSubmit(text);
            setMessage("");
            generateAnswer(e, text);
          }}
        >
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
                generateAnswer(e, text);
              }}
            >
              <VscSend />
            </div>
          ) : null}
        </form>
      </div>
      <Modal isOpen={generatingAnswer} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <Button
                color="secondary"
                isLoading={generateAnswer}
                className="w-full text-basse"
                radius="sm"
                type="submit"
              >
                Generating your response..
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Box;
