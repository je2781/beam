"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Google from "../../../public/google.png";
import Intro from "./Intro";

export default function Login() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    fullName: "",
  });

  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    if (
      user.email.includes("@") &&
      user.password.length > 0 &&
      user.fullName.length > 5
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, setButtonDisabled]);

  async function onRegister() {
    try {
      setIsLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/register`,
        { full_name: user.fullName, email: user.email, password: user.password }
      );

      if (res.data.id) {
        router.push("/login");
      } 
    } catch (error) {
      setIsLoading(false);
      const e = error as Error;
      return toast.error('Email already in use');
    }
  }

  return (
    <main className="flex flex-row items-start pt-6 pb-16 justify-end min-h-screen w-full">
      <Intro />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRegister();
        }}
        className="flex flex-col gap-y-6 bg-transparent lg:w-[75%] xl:w-[70%] h-full w-full items-center font-inter p-6 lg:px-0 "
      >
        <header className="mb-3 inline-flex flex-col lg:items-start items-center lg:w-[75%] xl:w-[70%] w-full">
          <h1
            className={`text-primary-700 font-semibold lg:text-4xl text-3xl lg:text-start text-center`}
          >
            Create an Account
          </h1>
          <h3
            className={`text-auth inline-flex items-center font-normal lg:text-lg text-sm mt-3 lg:text-start text-center`}
          >
            <span>Already have an account?&nbsp;</span>
            <Link className="btn underline-offset-1 underline" href="/login">
              Login
            </Link>
          </h3>
        </header>
        <div className="inline-flex flex-col lg:items-start md:items-center gap-y-1 lg:w-[75%] xl:w-[70%] md:w-[85%] w-full">
          <div className="w-full lg:w-[75%] xl:w-[70%] md:w-[85%] md:items-start inline-flex flex-col">
            <label className="text-base font-normal">Full Name</label>
          </div>
          <input
            className={`w-full lg:w-[75%] xl:w-[70%] md:w-[85%] px-3 py-2 bg-transparent h-12 border-[0.5px] border-primary-400 focus:outline-none focus:border-primary-800 focus:border-2 placeholder:font-inter placeholder:text-sm rounded-xl`}
            id="name"
            type="text"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            placeholder="Enter full name"
          />
        </div>
        <div className="inline-flex flex-col lg:items-start md:items-center gap-y-1 lg:w-[75%] xl:w-[70%] md:w-[85%] w-full">
          <div className="w-full lg:w-[75%] xl:w-[70%] md:w-[85%] md:items-start inline-flex flex-col">
            <label className="text-base font-normal">Email Address</label>
          </div>
          <input
            className={`w-full lg:w-[75%] xl:w-[70%] md:w-[85%] px-3 py-2 bg-transparent h-12 border-[0.5px] border-primary-400 focus:outline-none focus:border-primary-800 focus:border-2 placeholder:font-inter placeholder:text-sm rounded-xl`}
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="margarettissbroker@"
          />
        </div>
        <div className="inline-flex flex-col lg:items-start md:items-center gap-y-1 w-full lg:w-[75%] xl:w-[70%] md:w-[85%]">
          <div className="w-full lg:w-[75%] xl:w-[70%] md:w-[85%] md:items-start inline-flex flex-col">
            <label className="text-base font-normal">Password</label>
          </div>
          <div className="w-full lg:w-[75%] xl:w-[70%] md:w-[85%] focus-within:border-2 h-12 focus-within:border-primary-800 pr-4 border-[0.5px] border-primary-400 py-2 flex flex-row items-center bg-transparent rounded-xl justify-between">
            <input
              className="pl-3 py-1 w-full focus:outline-none placeholder:font-inter placeholder:text-sm h-full bg-transparent"
              id="password"
              type={`${isVisible ? "text" : "password"}`}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
            />
            <span
              className="cursor-pointer"
              onClick={() => setIsVisible((prevState) => !prevState)}
            >
              <i className="fa-solid fa-eye-slash text-lg text-primary-700/60"></i>
            </span>
          </div>
          <div className="inline-flex flex-row justify-start items-center w-full lg:w-[75%] xl:w-[70%] md:w-[85%] mt-2 gap-x-3">
            <input
              type="checkbox"
              className="text-white bg-white appearance-none w-[16px] h-[16px] border border-link rounded-sm relative
                      cursor-pointer outline-none checked:bg-link checked:after:absolute checked:after:content-[''] checked:after:top-[2px] checked:after:left-[5px] checked:after:w-[5px] checked:after:h-[8px]
                      checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:border-t-0 checked:after:border-l-0
                      checked:after:rotate-45"
            />
            <h5 className="font-normal text-sm">
              I agree to BeamMarkets{" "}
              <Link
                href={`/terms-of-service`}
                className="text-link underline underline-offset-2"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={`/privacy-policy`}
                className="text-link underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </h5>
          </div>
        </div>
        <div className="inline-flex flex-col lg:items-start md:items-center gap-y-6 w-full lg:w-[75%] xl:w-[70%] md:w-[85%] mt-3">
          <button
            disabled={buttonDisabled}
            onClick={onRegister}
            type="submit"
            className={`py-3 font-bold text-base text-white rounded-3xl w-full lg:w-[75%] xl:w-[70%] md:w-[85%] ${
              buttonDisabled
                ? "cursor-not-allowed bg-gradient-to-r from-primary-600/90 to-primary-800/90"
                : "hover:ring-2 ring-primary-800 cursor-pointer bg-gradient-to-r from-primary-600 to-primary-800"
            } `}
          >
            {isLoading ? "Processing.." : "Register"}
          </button>
          <div className="flex flex-row items-center font-normal text-sm w-full lg:w-[75%] xl:w-[70%] md:w-[85%]">
            <span className="border border-primary-150 border-l-0 border-r-0 border-b-0 w-[35%]"></span>

            <h3 className="mx-2 w-[30%] text-center text-auth">
              OR SIGNIN WITH
            </h3>
            <span className="border border-primary-150 border-l-0 border-r-0 border-b-0 w-[35%]"></span>
          </div>
          <div className="flex flex-row items-center justify-center gap-x-3 font-normal w-full lg:w-[75%] xl:w-[70%] md:w-[85%]">
            <button className="rounded-3xl px-12 py-2 border border-primary-300">
              <Image src={Google} width={24} height={24} alt="google login" />
            </button>
            <button className="rounded-3xl px-12 py-2 border border-primary-300">
              <i className="fa-brands fa-apple text-[22px]"></i>
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
