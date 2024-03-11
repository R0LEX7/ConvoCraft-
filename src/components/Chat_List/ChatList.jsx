"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Skeleton, ScrollShadow, Input } from "@nextui-org/react";

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
  console.log("data ", data);
  return data.data;
};

const ChatList = () => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;
  const [search, setSearch] = useState("");
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);

  let chats;

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    if (currentUser) {
      setLoading(true);
      const data = await getChats(currentUser._id, search);
      setChatData(data);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="w-[95%] my-1 flex justify-start flex-col gap-4">
        <Skeleton className="rounded-lg my-3">
          <div className="h-12 rounded-lg bg-default-300"></div>
        </Skeleton>
        <SkeletonLoading />
        <SkeletonLoading />
        <SkeletonLoading />
        <SkeletonLoading />
      </div>
    );
  }
  console.log("chats -> ", chatData);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetchData();
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
            {chatData && chatData.length === 0 && (
              <p className="text-danger ">no users found with {search}</p>
            )}

            {chatData !== undefined &&
              chatData.map((chat, index) => (
                <ChatBox
                  chat={chat}
                  index={index}
                  currentUser={currentUser}
                  // currentChatId={currentChatId}
                />
              ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default ChatList;
