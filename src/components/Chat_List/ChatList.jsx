"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Skeleton, ScrollShadow, Input } from "@nextui-org/react";
import { pusherClient } from "../../Config/pusher";

import ChatBox from "./ChatBox";
import { SkeletonLoading } from "../Loader/SkeletonLoading";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

//fnc to retrieve chats from server

const getChats = async (currentUserId, search) => {
  const response = await fetch(
    search.trim() === ""
      ? `/api/users/${currentUserId}`
      : `/api/users/${currentUserId}/search/${search}`
  );

  const data = await response.json();
  return data.data;
};

const ChatList = ({ currentChatId }) => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;
  const [search, setSearch] = useState("");
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);

  let chats;

  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    if (currentUser) {
      const data = await getChats(currentUser._id, search);
      setChatData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleEvent = async (updatedChat) => {
        console.log(updatedChat);
        setChatData((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, message: updatedChat.message };
            } else {
              return chat;
            }
          })
        );
      };
      console.log("chat data" , chatData)
      pusherClient.bind("updated-chat", handleEvent);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("updated-chat", handleEvent);
      };
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-[95%] my-1 flex justify-start flex-col gap-4">
        <form className="mb-3">
          <Input
            type="text"
            label="Search"
            placeholder="Search a Chat"
            startContent={
              <span>
                <FiSearch />
              </span>
            }
          />
        </form>
        <SkeletonLoading />
        <SkeletonLoading />
        <SkeletonLoading />
        <SkeletonLoading />
      </div>
    );
  }

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
    setSearch("")
  };

  return (
    <div className="w-[95%]">
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          type="text"
          label="Search"
          value={search}
          placeholder="Search a Chat"
          onChange={handleChange}
          startContent={
            <span>
              <FiSearch />
            </span>
          }
        />
      </form>

      <div>
        <ScrollShadow hideScrollBar className={"my-3 h-[400px] px-2"}>
          <div className="flex flex-col">
            {search.trim().length > 0 && chatData && chatData.length === 0 && (
              <p className="text-danger ">no users found with {search}</p>
            )}

            {chatData !== undefined &&
              chatData.map((chat, index) => (
                <ChatBox
                  key={chat._id}
                  chat={chat}
                  index={index}
                  currentUser={currentUser}
                  currentChatId={currentChatId || null}
                />
              ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default ChatList;
