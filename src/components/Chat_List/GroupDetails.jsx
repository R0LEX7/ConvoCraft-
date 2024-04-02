"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  User,
} from "@nextui-org/react";

const GroupDetails = ({ chat, onClose }) => {
  const router = useRouter();
  return (
    <>
      <ModalHeader className="text-center text-white capitalize">
        {chat.name} - Members
      </ModalHeader>
      <ModalBody className="text-white w-full">
        <div className="flex flex-col gap-2 justify-start">
          {chat &&
            chat?.members.map((member) => (
              <User
                name={member?.username}
                description={member?.email}
                avatarProps={{
                  src: member.profilePic,
                }}
              />
            ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};

export default GroupDetails;
