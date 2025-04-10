"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { dashboardItems } from "./helpers";
import Image, { StaticImageData } from "next/image";

import Logo from "../../public/logo.png";
import Switch from "@/components/ui/Switch";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "@/store/useAuth";

export function SideBarList(
  router: AppRouterInstance,
  paddingLeft: string,
  selectedSection: string,
  hide?: boolean,
  setHide?: React.Dispatch<React.SetStateAction<boolean>>
) {

  return (
    <div className="flex flex-col items-start lg:gap-y-9 font-inter w-full">
      <header className="lg:inline-flex hidden justify-start items-center w-full flex-row gap-x-3 border border-primary-200 h-[60px] pl-6 pb-10 border-t-0 border-l-0 border-r-0">
        <Image src={Logo} alt="logo" width={48} height={48} />
        <h1 className="font-bold text-sm text-white">BEAM</h1>
      </header>
      <ul className="flex flex-col gap-y-9 w-full">
        {dashboardItems.map((item, i, items) => (
          <li key={i} className="w-full flex flex-col gap-y-5">
            <h4
              className={`font-poppins font-normal text-sm text-white ${paddingLeft}`}
            >
              {Object.keys(item)[0].toUpperCase()}
            </h4>
            <ul className="w-full flex gap-y-2 flex-col text-primary-100 font-normal text-sm">
              {Array.isArray(Object.values(item)[0]) &&
                (Object.values(item)[0] as any[]).map(
                  (nestedlistItem, nestedIndex) => {
                    const sectionKey = Object.keys(nestedlistItem)[0]
                      .replace(" ", "")
                      .toLowerCase(); // Ensure it's a valid key
                    const isSelected = selectedSection.includes(sectionKey);

                    return (
                      <li
                        key={nestedIndex}
                        data-testid="sidebar-item"
                        className={`w-full cursor-pointer flex flex-row items-center group py-2 flex flex-row lg:gap-x-3 gap-x-3 md:gap-x-1 items-center w-[98.5%] lg:pl-7 pl-[17px]`}
                        onClick={async () => {
                          if (Object.keys(nestedlistItem)[0] === "Logout") {
                            try {
                              const res = await axios.post(
                                `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/auth/logout`
                              );

                              if (res.data.message === "logout successful") {
          
                                router.replace("/login");
                              } 
                            } catch (error) {
                              return toast.error("session logout failed");
                            }
                          } else {
                            router.push(
                              `/${Object.keys(nestedlistItem)[0]
                                .replace(" ", "")
                                .toLowerCase()}`
                            );
                          }
                        }}
                      >
                        <i
                          className={`fa-solid ${
                            Object.values(nestedlistItem)[0]
                          } xl:text-lg lg:text-[14px] w-[8%] md:w-[5%] lg:w-[13%] group-hover:text-secondary-400 ${
                            isSelected
                              ? "text-secondary-400"
                              : "text-primary-100"
                          }`}
                        ></i>
                        <h4
                          className={`w-[92%] md:w-[95%] lg:w-[87%] group-hover:text-secondary-400 ${
                            isSelected
                              ? "text-secondary-400"
                              : "text-primary-100"
                          }`}
                        >
                          {Object.keys(nestedlistItem)[0]}
                        </h4>
                      </li>
                    );
                  }
                )}
            </ul>
          </li>
        ))}
      </ul>
      <div className="flex flex-row w-full justify-center mt-8">
        <footer className="rounded-lg bg-white p-3 lg:pr-1 xl:p-3 inline-flex flex-row items-center justify-center gap-x-6 lg:gap-x-4 w-[90%]">
          <h3 className="text-primary-800 font-normal xl:text-[10px] text-[10px] lg:text-[8px]">
            Switch to dark mode
          </h3>
          <Switch
            id="hide"
            value="hide"
            onHide={setHide}
            hide={hide}
            switchLabel=""
          />
        </footer>
      </div>
    </div>
  );
}

export function HeaderContent(
  ProfilePic: StaticImageData,
  username: string,
  display = "hidden",
  flexProp = "",
  padding = ""
) {
  return (
    <div
      className={`lg:flex ${display} flex-row gap-x-10 xl:w-[26%] lg:w-[34%] w-full items-center lg:mt- mt-2 ${flexProp} ${padding}`}
    >
      <div className="flex flex-row lg:gap-x-8 gap-x-4 items-center">
        <div className="flex flex-row gap-x-5 items-center">
          <span
            className="h-[48px] w-[48px] overflow-hidden cursor-pointer rounded-[50%] ring-2 ring-offset-1 ring-search-icon"
            style={{ backgroundImage: `url(${ProfilePic})` }}
          >
            <Image
              src={ProfilePic}
              width={48}
              height={48}
              alt="prodile pic"
              className="object-cover w-full h-full"
            />
          </span>
          <div className="lg:flex hidden flex-row gap-x-3 items-center cursor-pointer">
            <h5 className="text-sm text-primary-800 font-normal">{username}</h5>
            <i className="fa-solid fa-angle-down text-sm text-search-text"></i>
          </div>
        </div>
        <span className="relative">
          <i className="fa-solid fa-bell xl:text-xl lg:text-lg text-search-notification cursor-pointer"></i>
          <span
            className={`transition-all duration-300 ease-out transform hover:scale-125 bg-search-baloon p-[5px] text-[.9rem] rounded-[50%] text-white font-inter absolute -right-[1px] top-[1px] font-bold`}
          ></span>
        </span>
      </div>
    </div>
  );
}

export function articleHeaderTemplate(width: string, title: string) {
  return (
    <li className={`${width} cursor-pointer`}>
      <h5>{title}</h5>
    </li>
  );
}

export function detailsModalHeader() {
  return (
    <div className="inline-flex flex-col items-start gap-y-3 font-inter">
      <h3 className="font-semibold text-lg text-black absolute left-6 top-5">
        Payment Details
      </h3>
      <h4 className="font-normal text-[18px] text-auth absolute left-6 top-8">
        Please confirm the margin details
      </h4>
    </div>
  );
}

export function addFundsModalHeader() {
  return (
    <h3 className="font-inter font-semibold text-lg text-black absolute left-6 top-5">
      Payment Option
    </h3>
  );
}
