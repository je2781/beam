"use client";

import SearchBar from "./Search";
import ProfilePic from "../../../../public/profile.png";
import Logo from "../../../../public/logo.png";
import React from "react";
import Image from "next/image";
import { MobileModal } from "../Modal";
import { useRouter } from "next/navigation";
import { HeaderContent, SideBarList } from "@/helpers/LayoutContent";
import useWindowWidth from "@/helpers/getWindowWidth";

export default function Header({
  username,
  activeSection,
  hide,
  onHide,
}: {
  username: string;
  activeSection: string;
  hide: boolean;
  onHide: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isMobileModalOpen, setIsMobileModalOpen] = React.useState(false);
  const router = useRouter();
  const windowWidth = useWindowWidth();

  let timerId: NodeJS.Timeout | null = null;

  //cleaning up asynchronous callback timers
  React.useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  React.useEffect(() => {
    const mobileNav = document.querySelector("#mobile-nav") as HTMLElement;
    if (isMobileModalOpen && mobileNav) {
      mobileNav.classList.add("forward");
      mobileNav.classList.remove("backward");
    }
  }, [isMobileModalOpen]);

  const showModalHandler = () => {
    setIsMobileModalOpen(true);
  };

  const hideModalHandler = () => {
    const mobileNav = document.querySelector("#mobile-nav") as HTMLElement;
    if (mobileNav) {
      mobileNav.classList.remove("forward");
      mobileNav.classList.add("backward");
      timerId = setTimeout(() => {
        setIsMobileModalOpen(false);
      }, 300);
    } else {
      setIsMobileModalOpen(false);
    }
  };

  React.useEffect(() => {
    if (windowWidth > 768) {
      setIsMobileModalOpen(false);
    } else {
      setIsMobileModalOpen(false);
    }
  }, [setIsMobileModalOpen, windowWidth]);

  return (
    <nav className="lg:pl-[18.5%] xl:pl-[274px] md:pl-[4%] pl-[6%] lg:pr-0 xl:pr-[23px] md:pr-[4%] pr-[6%] lg:py-[1.6%] md:py-[3%] py-[6%] flex flex-row items-start justify-between w-full fixed h-[100px] top-0 left-0 z-5 bg-white border border-primary-100 border-t-0 border-l-0 border-r-0">
      <div className="flex flex-row xl:gap-x-34 lg:gap-x-8 items-center xl:w-[55%] lg:w-[57%] w-full justify-between">
        <Image
          src={Logo}
          alt="logo"
          width={48}
          height={48}
          className="lg:hidden inline-block"
        />
        <SearchBar display="hidden" />
        <span
          className="lg:hidden mt-3 cursor-pointer"
          onClick={showModalHandler}
          id="toggle-button"
        >
          <i className="fa-solid fa-bars text-primary-500 text-2xl"></i>
        </span>
      </div>
      {HeaderContent(ProfilePic, username)}
      {isMobileModalOpen && (
        <MobileModal onClose={hideModalHandler}>
          <>
            {HeaderContent(
              ProfilePic,
              username,
              "flex",
              "justify-between",
              "px-[18px]"
            )}
            <SearchBar display="flex" />
            <ul className="inline-flex items-start flex-col w-full font-sans font-normal gap-y-8">
              {SideBarList(router, "pl-[16px]", activeSection, hide, onHide)}
            </ul>
          </>
        </MobileModal>
      )}
    </nav>
  );
}
