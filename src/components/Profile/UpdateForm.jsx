"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  User,
  Input,
} from "@nextui-org/react";
import { CldUploadButton } from "next-cloudinary";

import { FaCamera } from "react-icons/fa";

const UpdateForm = ({ user, onClose }) => {
  const router = useRouter();

  const [username, setUsername] = useState(user?.username);
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);

  const uploadPhoto = (result) => {
    console.log(result?.info?.secure_url);
    setProfilePic(result?.info?.secure_url);
  };

  const updateProfile = async () => {
    setLoading(true);
    const response = await fetch(`/api/users/${user._id}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        profilePic,
      }),
    });

    if (response.ok) {
      setLoading(false);
      window.location.reload();
    }

    if (response.error) {
      console.log("error in updating profile", error);
    }
  };

  return (
    <>
      <ModalHeader className="text-center text-white capitalize">
        Update Profile
      </ModalHeader>
      <ModalBody className="text-white w-full">
        <div className="flex flex-col gap-2 justify-start">
          <Input
            type="text"
            label="Username"
            placeholder={user?.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button color="success" endContent={<FaCamera />}>
            <CldUploadButton
              options={{ maxFiles: 1 }}
              onUpload={uploadPhoto}
              uploadPreset="tzwbyyhp"
            >
              Update Profile Pic
            </CldUploadButton>
          </Button>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" radius="sm" onPress={onClose}>
          Close
        </Button>
        <Button color="secondary" onPress={updateProfile}>
          Save Changes
        </Button>
      </ModalFooter>
    </>
  );
};

export default UpdateForm;
