'use client';

import { usePathname } from "next/navigation";
import Header from "../layout/header/Header";
import Sidebar from "../layout/Sidebar";
import Content from "./Content";
import trans from '../../../public/transactions.json';
import React from "react";

export default function Dashboard({token}: {token: string | undefined}) {
  const pathName = usePathname();
  const [hide, setHide] = React.useState<boolean>(false);

  return (
    <div className="bg-auth/1 relative">
      <Header username="Magnartis LTD" activeSection={pathName.slice(1)} hide={hide} onHide={setHide}/>
      <Sidebar activeSection={pathName.slice(1)} hide={hide} onHide={setHide}/>
      <Content data={{transactions: trans, sectionName: pathName.slice(1), token}}/>
    </div>
  );
}
