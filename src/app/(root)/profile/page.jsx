"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {Spinner} from "@nextui-org/react";
import { Profile } from "../../../components/index";



const page = () => {
  const { data: session } = useSession();
  console.log("profile page",session);


  return (
    <div>
      {session && session.user ? <Profile user={session.user} isUser={true} /> : (
         <Spinner label="Secondary" color="secondary" labelColor="secondary"/>
      )}
    </div>
  );
};

export default page;
