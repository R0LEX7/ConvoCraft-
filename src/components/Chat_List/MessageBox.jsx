"use client";
import React from "react";
import { Avatar, Card, CardBody, Image } from "@nextui-org/react";
import { dummyUserImg } from "../index";
import { format } from "date-fns";

const MessageBox = ({ message, currentUser }) => {
  return (
    <div>
        {message.sender._id !== currentUser?._id ? (
      <div className="w-[400px] lg:w-1/2 md:w-1/2 h-auto flex items-start gap-1 mt-2">

          <Avatar
            src={
              sender.profilePic.length > 0 ? sender.profilePic : dummyUserImg
            }
            className="w-6 h-6 text-tiny mt-1"
          />
          <div className="flex flex-col">
          <Card className="mb-0">
            {message.text ? (
                <CardBody className="text-sm w-[190px] lg:w-[300px] md:w-[300px] px-2 pt-2">
                {message?.text}
              </CardBody>
            ) : (
              <Image
              isBlurred
                width={240}
                src={message?.photo}
                alt="image"
                classNames="m-5"
                />
            )}
          </Card>
          <span className=" ml- text-[10px] text-right opacity-50 mr-1">
            by {message} {format(new Date(message?.createdAt) , "p") }
          </span>
        </div>
      </div>
      ) : (
        <div className="w-[400px] lg:w-1/2 md:w-1/2 h-auto flex items-start gap-1 mt-2">

          <div className="flex flex-col">
          <Card className="mb-0">
            {message.text ? (
                <CardBody className="text-sm w-[190px] lg:w-[300px] md:w-[300px] px-2 pt-2">
                {message?.text}
              </CardBody>
            ) : (
              <Image
              isBlurred
                width={240}
                src={message?.photo}
                alt="image"
                classNames="m-5"
                />
            )}
          </Card>
          <span className=" ml- text-[10px] text-right opacity-50 mr-1">
            by {message} {format(new Date(message?.createdAt) , "p") }
          </span>
        </div>
      </div>
      )}
      </div>
  );
};

export default MessageBox;