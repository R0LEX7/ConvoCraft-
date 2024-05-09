"use client";
import React from "react";
import { Avatar, Card, CardBody, Image } from "@nextui-org/react";
import { dummyUserImg, aiAvatar } from "../index";

import { format } from "date-fns";

const MessageBox = ({ message }) => {
  return (
    <div>
      {!message.byUser ? (
        <div className="w-[400px] lg:w-1/2 md:w-1/2  flex items-start gap-1 mt-2">
          <Avatar src={aiAvatar} className="w-6 h-6 text-tiny mt-1" />
          <div className="flex flex-col items-start w-[60%]">
            <Card className="" radius="sm">
              <CardBody className="text-sm  h-auto   px-2 pt-2">
                {message?.text}
              </CardBody>
            </Card>
            <span className=" ml- text-[10px] text-right opacity-50 mr-1">
              {format(new Date(message?.id), "p")}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full flex items-end">
          <div className=" w-full h-auto flex justify-end gap-1 mt-2">
            <div className="flex flex-col items-end w-[60%]">
              <Card
                className={` ${message?.text && "bg-secondary"}   `}
                radius="sm"
              >
                <CardBody className="text-sm h-auto px-2 pt-2">
                  {message?.text}
                </CardBody>
              </Card>
              <span className=" ml- text-[10px] text-right opacity-50 mr-1">
                {format(new Date(message?.id), "p")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
