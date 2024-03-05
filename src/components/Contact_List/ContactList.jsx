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

const getAllUsers = async (search) => {
  const response = await fetch( search === "" ? "/api/users" : `/api/users/search/${search}`);
  const data = await response.json();
  return data?.data;
};

const ContactList = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [allUsers, setAllUsers] = useState(null);
  const [search , setSearch] = useState("");
  const [err , setErr] = useState(true)

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

 const { data, error, isPending ,isSuccess,refetch} =useQuery({
  queryKey: ["users"],
  queryFn:() =>   getAllUsers(search)
});


 let filteredUsers =[];

  if (isPending) {
    return <span>Loading...</span>;
  }else {
      filteredUsers = data.filter(
        (contact) => contact._id !== session?.user._id
      );
          console.log("filter" , filteredUsers)
  }

  const handleSubmit = (e) => {
    setErr(true)
    e.preventDefault();
    console.log("seaching...");
    refetch()
  };

  const handleChange = (e)=> {
    setErr(false)
    setSearch(e.target.value)
  }
  return (
    <div className="w-[95%]">
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          type="text"
          label="Search"
          placeholder="Search a User"
          onChange = {handleChange}
          startContent={
            <span>
              <FiSearch />
            </span>
          }
        />
      </form>
      <div>
        <ScrollShadow hideScrollBar className=" h-[564px] px-2">
        <div className="flex flex-col  justify-center items-center">
          {filteredUsers.length === 0 &&  err && (
            <p className="text-danger "
            >
               no users found with {search}
            </p>
            )
}
       
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
      color="secondary"
      classNames={{
        base: cn(
          "inline-flex w-full max-w-md bg-content1",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-secondary"
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
            <Link  color="secondary"
            size="sm">
              {contact.email}
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
