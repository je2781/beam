"use client";

import { SideBarList } from "@/helpers/LayoutContent";
import { useRouter } from "next/navigation";

export default function Sidebar({
  activeSection,
  hide,
  onHide,
}: {
  activeSection: string;
  hide: boolean;
  onHide: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  return (
    <nav
      id="sidebar"
      className="fixed left-0 top-0 bg-primary-850 h-[100vh] overflow-y-auto py-10 px-1 xl:w-[245px] lg:w-[176px] hidden
        shadow-md lg:flex flex-col justify-between scrollbar-hidden hover:scrollbar-hover z-20"
    >
      <ul
        className={`inline-flex items-start flex-col w-full font-sans font-normal gap-y-8`}
      >
        {SideBarList(router, "lg:pl-7 xl:pl-6 pl-8", activeSection, hide, onHide)}
      </ul>
    </nav>
  );
}
