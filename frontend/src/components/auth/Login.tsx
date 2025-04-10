"use client";

import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Intro from "./Intro";
import useAuth from "@/store/useAuth";

export default function Login() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const {setAuthStatus} = useAuth();

  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    if (user.email.includes("@") && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user, setButtonDisabled]);

  async function onLogin() {
    try {
      setIsLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/login`,{
          email: user.email,
          password: user.password
        }
      );

      if (res.data.payload.email) {
        toast.success("Login successful!", {
          duration: 2000,
        });
        
        router.push("/wallet");
        
      } 
    } catch (error) {
      setIsLoading(false);
      return toast.error('Credential Invalid');
    }
  }

  return (
    <main className="flex flex-row items-start pt-32 pb-16 justify-end min-h-screen w-full">
      <Intro />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin();
        }}
        test-id='login-form'
        className="flex flex-col gap-y-6 bg-transparent lg:w-[75%] xl:w-[70%] h-full w-full items-center font-inter p-6 lg:px-0 "
      >
        <header className="mb-3 inline-flex flex-col lg:items-start items-center lg:w-[75%] xl:w-[70%] w-full">
          <h1
            className={`text-primary-700 font-semibold lg:text-4xl text-3xl lg:text-start text-center`}
          >
            Sign in to Beam
          </h1>
          <h3
            className={`text-auth font-normal lg:text-lg text-sm mt-3 lg:text-start text-center`}
          >
            Please sign in with your assigned login details.
          </h3>
        </header>
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
              aria-label="show"
              role='menuitem'
              onClick={() => setIsVisible((prevState) => !prevState)}
            >
              <i className="fa-solid fa-eye-slash text-lg text-primary-700/60"></i>
            </span>
          </div>
          <div className="inline-flex flex-row justify-end w-full lg:w-[75%] xl:w-[70%] md:w-[85%] mt-1">
            <Link
              href={`/resetpassword`}
              className="btn text-center text-primary-400 text-sm font-normal"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <div className="inline-flex flex-col lg:items-start md:items-center gap-y-6 w-full lg:w-[75%] xl:w-[70%] md:w-[85%] mt-3">
          <button
            disabled={buttonDisabled}
            onClick={onLogin}
            type="submit"
            className={`py-3 font-bold text-base text-white rounded-3xl w-full lg:w-[75%] xl:w-[70%] md:w-[85%] ${
              buttonDisabled
                ? "cursor-not-allowed bg-gradient-to-r from-primary-600/90 to-primary-800/90"
                : "hover:ring-2 ring-primary-800 cursor-pointer bg-gradient-to-r from-primary-600 to-primary-800"
            } `}
          >
            {isLoading ? "Processing.." : "Log in"}
          </button>
          <h4 className="text-base text-primary-400 w-full lg:w-[75%] xl:w-[70%] md:w-[85%] text-center">
            Dont&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary-800 font-bold">
              Signup
            </Link>
          </h4>
        </div>
      </form>
    </main>
  );
}
