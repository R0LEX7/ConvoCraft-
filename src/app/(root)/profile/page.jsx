"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import { Profile } from "../../../components/index";
import { SkeletonLoading } from "../../../components/Profile/SkeletonLoading";

const page = () => {
  const { data: session } = useSession();
  console.log("profile page", session);

  return (
    <div className="w-full h-5/6 grid place-items-center">
      {session && session.user ? (
        <Profile user={session.user} isUser={true} />
      ) : (
        <SkeletonLoading />
      )}
    </div>
  );
};

export default page;
