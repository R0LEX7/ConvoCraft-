"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import {
  ScrollShadow,
  Checkbox,
  Link,
  User,
  Chip,
  cn,
  Input,
} from "@nextui-org/react";

const getAllUsers = async () => {
  const response = await fetch("/api/users");
  const data = await response.json();
  return data?.data;
};

const ContactList = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [allUsers, setAllUsers] = useState(null);

  let currentUser;

  useEffect(() => {
    if (session) {
      if (!session.user) {
        router.replace("/");
      } else {
        currentUser = session?.user;
      }
    }
  }, [session]);

 const { data, error, isPending ,  isSuccess, } = useQuery({
  queryKey: ["users"],
  queryFn: getAllUsers,
});


 let filteredUsers;

  if (isPending) {
    return <span>Loading...</span>;
  }else {
      filteredUsers = data.filter(
        (contact) => contact._id !== session?.user._id
      );
          console.log("filter" , filteredUsers)
  }

// useEffect(() => {
//   const filteredUsers = data.filter(
//         (contact) => contact._id !== session?.user._id
//       );
//       console.log("Filtered users:", filteredUsers);
//       setAllUsers(filteredUsers);
// },[data , session])
  

  console.log("all", data);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("seaching...");
  };
  return (
    <div className="w-[95%]">
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          type="text"
          label="Search"
          placeholder="Search a User"
          startContent={
            <span>
              <FiSearch />
            </span>
          }
        />
      </form>
      <div>
        <ScrollShadow hideScrollBar className=" h-[564px] px-2 ">
        <div className="flex flex-col  justify-center items-center">
          
       
          {filteredUsers && filteredUsers.map((contact) => <Contact key={contact._id} contact={contact} />)}
          {filteredUsers && filteredUsers.map((contact) => <Contact key={contact._id} contact={contact} />)}
           </div>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default ContactList;

const Contact = ({ contact }) => {
   const [isSelected, setIsSelected] = useState(false);
  const user = {
    name: "Junior Garcia",
    avatar: "https://avatars.githubusercontent.com/u/30373425?v=4",
    username: "jrgarciadev",
    url: "https://twitter.com/jrgarciadev",
    role: "Software Developer",
    status: "Active",
  };

  return (
  <div className="my-4 w-full">
    <Checkbox
      aria-label={contact.username}
      classNames={{
        base: cn(
          "inline-flex w-full max-w-md bg-content1",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full",
      }}
      isSelected={isSelected}
      onValueChange={setIsSelected}
    >
      <div className="w-full flex justify-between gap-2">
        <User
          avatarProps={{ size: "md", src: contact.profilePic }}
          description={
            <Link isExternal href={user.url} size="sm">
              @{contact.email}
            </Link>
          }
          name={contact.username}
        />
        {/*<div className="flex flex-col items-end gap-1">
          <span className="text-tiny text-default-500">{user.role}</span>
          <Chip color="success" size="sm" variant="flat">
            {user.status}
          </Chip>
        </div>*/}
      </div>
    </Checkbox>
    </div>
  );
};
