"use client";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdAlternateEmail, MdLockOutline } from "react-icons/md";
import { PiSmileyXEyesBold } from "react-icons/pi";
import { Button } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FaRegMehRollingEyes } from "react-icons/fa";

const Form = ({ type }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPass, setShowPass] = useState(false);

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };
  return (
    <div class="relative flex flex-col text-gray-700   shadow-none rounded-xl bg-clip-border w-full h-screen justify-center items-center ">
      <h4 class="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Sign Up
      </h4>
      <p class="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
        Nice to meet you! Enter your details to register.
      </p>
      <form class="max-w-screen-lg mt-8 gap-3  mb-2 w-80  sm:w-96">
        {type === "register" && (
          <div>
            <div className="flex justify-between  items-center bg-white text-2xl ">
              <Input
                type="text"
                label="Username"
                color="secondary"
                {...register("username", {
                  required: "Username is required",
                  validate: (val) => {
                    if (val.length < 3) {
                      return "Username must be at least 3 characters";
                    }
                  },
                })}
                radius="sm"
                endContent={<FaRegUser />}
                isInvalid={errors.username ? true : false}
                errorMessage={errors.username && errors.username.message}
                classNames={
                  {
                    //    inputWrapper: "bg-white"
                  }
                }
              />
            </div>
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
        )}
        <div>
          <div className="flex mt-2 justify-between items-center bg-white text-2xl ">
            <Input
              type="email"
              label="Email"
              color="secondary"
              className=""
              radius="sm"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email",
                },
              })}
              endContent={<MdAlternateEmail />}
            />
          </div>
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <div className="flex mt-2 justify-between items-center bg-white text-2xl">
            <Input
              type={showPass ? "text" : "password"}
              label="Password"
              className="bg-[#ffff]"
              color="secondary"
              radius="sm"
              {...register("password", {
                required: "Password is required",
                validate: (value) => {
                  if (
                    value.length < 5 ||
                    !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                  ) {
                    return "Password must be at least 5 characters and contain at least one special character";
                  }
                },
              })}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={handleShowPass}
                >
                  {showPass ? <FaRegMehRollingEyes /> : <PiSmileyXEyesBold />}
                </button>
              }
            />
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex mt-2 justify-center w-full items-center bg-white ">
          <Button
            color="secondary"
            className="w-full"
            radius="sm"
            type="submit"
          >
            {type === "register" ? "Register" : "Login"}
          </Button>
        </div>
      </form>
      {type === "register" ? (
        <Link href="/" className="link">
          <p className="text-center">Already have an account? Sign In Here</p>
        </Link>
      ) : (
        <Link href="/register" className="link">
          <p className="text-center">Don't have an account? Register Here</p>
        </Link>
      )}
    </div>
  );
};

export default Form;
