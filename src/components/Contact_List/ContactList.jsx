"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import {
  cn,
  Link,
  Chip,
  User,
  Input,
  Button,
  Checkbox,
  ScrollShadow,
} from "@nextui-org/react";

import { GrGroup, GrLinkNext } from "react-icons/gr";

const getAllUsers = async (search) => {
  const response = await fetch(
    search === "" ? "/api/users" : `/api/users/search/${search}`
  );
  const data = await response.json();
  return data?.data;
};

const createChat = async (currentUser, selected, isGroup, name) => {
  const response = await fetch(`/api/chat`, {
    method: "POST",
    body: JSON.stringify({
      currentUserId: currentUser._id,
      members: selected.map((item) => item._id),
      isGroup,
      name,
    }),
  });
  const data = await response.json();
  return data?.data;
};

const ContactList = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [allUsers, setAllUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [err, setErr] = useState(true);
  const [groupName, setGroupName] = useState("");

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

  /* data fetching */
  const { data, error, isPending, isSuccess, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(search),
  });

  const isGroup = selected.length > 1;

  /* post method using tanstack query */
  const {} = useMutation({
    mutationFn: () => createChat(currentUser, selected, isGroup, groupName),
  });

  let filteredUsers = [];

  if (isPending) {
    return <span>Loading...</span>;
  } else {
    filteredUsers = data.filter((contact) => contact._id !== session?.user._id);
    console.log("filter", filteredUsers);
  }

  const handleSubmit = (e) => {
    setErr(true);
    e.preventDefault();
    refetch();
  };

  const handleSelect = (contact) => {
    if (selected.includes(contact)) {
      setSelected((prev) => prev.filter((item) => item !== contact));
    } else {
      setSelected((prev) => [...prev, contact]);
    }
  };

  const handleChange = (e) => {
    setErr(false);
    setSearch(e.target.value);
  };
  return (
    <div className="w-[95%] ">
      <form onSubmit={handleSubmit} className="mb-3">
        <Input
          type="text"
          label="Search"
          placeholder="Search a User"
          onChange={handleChange}
          startContent={
            <span>
              <FiSearch />
            </span>
          }
        />
      </form>
      <div className="flex lg:gap-10 md:gap-8 gap-3  lg:flex-row md:flex-col flex-col">
        <div className="lg:w-1/2 md:w-1/2">
          <ScrollShadow hideScrollBar className={" mb-3 h-[400px] px-2"}>
            <div className="flex flex-col  justify-center items-center">
              {filteredUsers.length === 0 && err && (
                <p className="text-danger ">no users found with {search}</p>
              )}

              {filteredUsers &&
                filteredUsers.map((contact) => (
                  <Contact
                    key={contact._id}
                    contact={contact}
                    handleSelect={handleSelect}
                  />
                ))}
            </div>
          </ScrollShadow>
        </div>
        <div className="lg:w-1/2 md:w-1/2">
          {isGroup && (
            <div>
              <form>
                <Input
                  type="text"
                  label="Group Name"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                  startContent={
                    <span>
                      <GrGroup />
                    </span>
                  }
                />
              </form>
              <div className="my-2 flex flex-col ">
                <div className="my-2 text-sm">Selected Members are..</div>
                <div className="my-2 flex flex-wrap">
                  {selected.length > 0 &&
                    selected.map((item) => (
                      <div key={item._id} className="mr-1 my-1">
                        <Chip color="secondary">{item.username}</Chip>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <Button
            color="secondary"
            isLoading={false}
            className="w-full text-basse"
            radius="sm"
            type="submit"
            isDisabled={selected.length === 0}
            endContent={<GrLinkNext />}
          >
            Find or Start a new Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactList;

const Contact = ({ contact, handleSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const avatar = "https://avatars.githubusercontent.com/u/30373425?v=4";

  console.log("select ", isSelected);

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
        onValueChange={() => {
          setIsSelected(!isSelected);
          handleSelect(contact);
        }}
      >
        <div className="w-full flex justify-between gap-2">
          <User
            avatarProps={{
              size: "md",
              src: contact.profilePic.length > 0 ? contact.profilePic : avatar,
            }}
            description={
              <Link color="secondary" size="sm">
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
