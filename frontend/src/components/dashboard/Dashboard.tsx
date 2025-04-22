'use client';

import { usePathname } from "next/navigation";
import Header from "../layout/header/Header";
import Sidebar from "../layout/Sidebar";
import Content from "./Content";
import trans from '../../../public/transactions.json';
import React from "react";

export default function Dashboard({transactions, balance, bank}: {transactions: any[], balance: number, bank: any}) {
  const pathName = usePathname();
  const [hide, setHide] = React.useState<boolean>(false);

  return (
    <>
      <Header username="Magnartis LTD" activeSection={pathName.slice(1)} hide={hide} onHide={setHide}/>
      <Sidebar activeSection={pathName.slice(1)} hide={hide} onHide={setHide}/>
      <Content userTransactions={transactions} walletBalance={balance} sectionName={pathName.slice(1)} bank={bank}/>
    </>
  );
}