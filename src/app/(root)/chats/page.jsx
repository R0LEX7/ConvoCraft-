"use client";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session } = useSession();
  console.log("====================================");
  console.log("auth data", session);
  console.log("====================================");
  return (
    <div className="flex justify-center items-center w-full h-screen">

      <h1>hyyy</h1>
    </div>
  );
};

export default page;
