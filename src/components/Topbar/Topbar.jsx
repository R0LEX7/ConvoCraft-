"use client";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {dummyUserImg} from "../index"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { id: 1, name: "chats", path: "/chats" },
  { id: 2, name: "Users", path: "/contact" },
  { id: 3, name: "Profile", path: "/profile" },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();

  const user = data?.user;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Initial check
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar
      maxWidth="xl"
      className="border-b-secondary"
      isBordered={true}
      isMenuOpen
      shouldHideOnScroll
    >
      <NavbarBrand>
        <Link href="/chats">
          <p className="text-inherit text-xl">ConvoCraft</p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map((item) => (
          <NavbarItem isActive={pathname === item.path} key={item.id}>
            <Link
              color={pathname === item.path ? "black" : "white"}
              href={item.path}
              className={`${
                pathname === item.path ? "black" : "white"
              } capitalize`}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end" isMobile>
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src={
                user
                  ? user.profilePic
                  : dummyUserImg
              }
            />
          </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>

              {isMobile && navItems.map((item) => (
                <DropdownItem
                  key={item.id}
                  className="capitalize"
                  onClick={() => router.push(item.path)}
                >
                  {item.name}
                </DropdownItem>
              ))}
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>

        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
