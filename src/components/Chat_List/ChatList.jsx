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
  search = "";
  const response = await fetch(`/api/users/${currentUserId}`);

  const data = await response.json();
  console.log("data ", data);
  return data.data;
};

const ChatList = ({ currentChatId }) => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;
  const [search, setSearch] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["chats"],
    queryFn: () => getChats(currentUser._id, search),
  });

  let chats;

  if (isPending) {
    return <SkeletonLoading />;
  } else {
    chats = data;
  }
  console.log("chats -> ", data);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-[95%]">
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          value={search}
          type="text"
          label="Search"
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
        <ScrollShadow hideScrollBar className={" mb-3 h-[400px] px-2"}>
          <div className="flex flex-col  justify-center items-center">
            {data && data.length === 0 && (
              <p className="text-danger ">no users found with {search}</p>
            )}

            {chats !== undefined &&
              chats.map((chat, index) => (
                <ChatBox
                  chat={chat}
                  index={index}
                  currentUser={currentUser}
                  currentChatId={currentChatId}
                />
              ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default ChatList;

const LoadingSkeleton = ({ height }) => {
  return (
    <Skeleton className="w-full rounded-lg">
      <div className={`h-${height} rounded-lg bg-default-300`}></div>
    </Skeleton>
  );
};
