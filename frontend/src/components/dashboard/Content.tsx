"use client";

import React from "react";
import PaginationComponent from "../layout/Pagination";
import { articleHeaderTemplate } from "@/helpers/LayoutContent";
import { useRouter } from "next/navigation";
import useWindowWidth from "@/helpers/getWindowWidth";
import { AddFundsModal, TransferModal } from "../layout/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { detectIssuer } from "@/helpers/helpers";

import visaLogo from "../../../public/visa.png";
import mastercardLogo from "../../../public/mastercard.png";

// Import Swiper styles
import "swiper/css";

export default function Content({
  data,
  walletBalance,
  sectionName,
  bank,
}: {
  data: any;
  walletBalance: number;
  sectionName: string;
  bank: any;
}) {
  let timerId: NodeJS.Timeout | null = null;

  //limiting the max number of items shown per page
  const ITEMS_PER_PAGE = 9;
  const [dividerPositions, setDividerPositions] = React.useState(
    [
      { top: "71px" },
      { top: "119px" },
      { top: "167px" },
      { top: "215px" },
      { top: "263px" },
      { top: "313px" },
      { top: "362px" },
      { top: "410px" },
      { top: "458px" },
    ].slice(
      0,
      data.transactions.length < ITEMS_PER_PAGE
        ? data.transactions.length
        : ITEMS_PER_PAGE
    )
  );

  const [count, setCount] = React.useState<number>(
    data.transactions.length < ITEMS_PER_PAGE
      ? data.transactions.length
      : ITEMS_PER_PAGE
  );
  const [visibleTrans, setVisibleTrans] = React.useState<Array<any>>(
    data.transactions.slice(0, ITEMS_PER_PAGE)
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedTransId, setSelectedTransId] = React.useState<string | null>(
    null
  );
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = React.useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [issuer, setIssuer] = React.useState("MasterCard");
  const [email, setEmail] = React.useState("");
  const [amount, setAmount] = React.useState(0);
  const [note, setNote] = React.useState("");
  const [cvv, setCVV] = React.useState(bank.cvv);
  const [cardNo, setCardNo] = React.useState(bank.card_no);
  const [exp, setExp] = React.useState(bank.card_expiry_date);
  const [transferModalHeader, setTransferModalHeader] = React.useState(
    "Withdraw"
  );

  const [trans, setTrans] = React.useState<any[]>(data.transactions);
  const [balance, setBalance] = React.useState<number | null>(walletBalance);
  const windowWidth = useWindowWidth();
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const swiperRef = React.useRef<SwiperType>(null);

  const goToSlide = (index: number) => {
    swiperRef.current?.slideTo(index); // jump to a specific slide
    setActiveIndex(index);
  };

  React.useEffect(() => {
    if (
      (selectedOption.length > 0 && selectedOption === "card") ||
      amount > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [setButtonDisabled, selectedOption, amount]);

  //cleaning up asynchronous callback timers

  React.useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  React.useEffect(() => {
    const addFundsDetails = document.querySelector("#add-funds") as HTMLElement;
    const userTransfer = document.querySelector("#transfer") as HTMLElement;
    const paymentDetails = document.querySelector(
      "#payment-details"
    ) as HTMLElement;

    // Handle addFunds settings animation
    if (isAddFundsModalOpen && addFundsDetails) {
      addFundsDetails.classList.add(
        "animate-[slideDown_0.3s_ease-out_forwards]"
      );
      addFundsDetails.classList.remove(
        "animate-[slideUp_0.3s_ease-out_forwards]"
      );
    }

    // Handle addFunds settings animation
    if (isDetailsModalOpen && paymentDetails) {
      paymentDetails.classList.add(
        "animate-[fadeInRight_0.3s_ease-out_forwards]"
      );
      paymentDetails.classList.remove(
        "animate-[fadeOutLeft_0.3s_ease-in_forwards]"
      );
    }

    // Handle user options animation
    if (isTransferModalOpen && userTransfer) {
      userTransfer.classList.add("animate-[slideDown_0.3s_ease-out_forwards]");
      userTransfer.classList.remove("animate-[slideUp_0.3s_ease-out_forwards]");
    }
  }, [isAddFundsModalOpen, isTransferModalOpen, isDetailsModalOpen]);

  const showAddFundsModalHandler = () => {
    setIsAddFundsModalOpen(true);
  };

  const showTransferModalHandler = (title: string) => {
    // setSelectedTransId(transId);
    setTransferModalHeader(title);
    setIsTransferModalOpen(true);
  };

  const hideModalHandler = (
    modalId: string,
    setModalState: React.Dispatch<React.SetStateAction<boolean>>,
    fadeOut?: string
  ) => {
    //reseting index of swiper
    setActiveIndex(0);

    const modal = document.querySelector(`#${modalId}`) as HTMLElement;

    if (modal) {
      if (fadeOut) {
        modal.classList.remove(
          `animate-[fadeIn${fadeOut}_0.3s_ease-out_forwards]`
        );
        modal.classList.add(
          `animate-[fadeOut${fadeOut}_0.3s_ease-out_forwards]`
        );
      } else {
        modal.classList.remove(`animate-[slideDown_0.3s_ease-out_forwards]`);
        modal.classList.add(`animate-[slideUp_0.3s_ease-out_forwards]`);
      }

      timerId = setTimeout(() => {
        setModalState(false);
      }, 300);
    } else {
      setModalState(false);
    }
  };

  //navigating to details page
  async function openDetailsPage(id: string) {
    router.push(`/transactions/${id}`);
  }

  return (
    <main
      role="main"
      className="xl:pl-[274px] font-inter lg:pl-[192px] xl:pr-12 lg:pr-3 lg:pt-[135px] lg:pb-12 pb-8 pt-[145px] px-5 lg:px-0 min-h-screen flex flex-col gap-y-8"
    >
      <header className="font-bold text-2xl text-primary-850 text-center lg:text-start">
        {sectionName[0].toUpperCase() + sectionName.slice(1)}
      </header>
      <hr className="border border-primary-200 border-l-0 border-r-0 border-t-0" />

      <div className="flex lg:flex-row flex-col lg:justify-between gap-y-6 lg:gap-y-0 w-full lg:pr-3 xl:pr-0 h-full">
        <div className="flex flex-col gap-y-5 xl:w-[37%] lg:w-[22%] w-full">
          <article className="flex flex-col w-full h-fit bg-wallet-summary-bg pt-7 pb-10">
            <div className="inline-flex flex-col gap-y-4 xl:px-6 px-6 lg:px-4">
              <div className="inline-flex flex-row items-center justify-between">
                <h4 className="font-medium text-[12px] text-primary-400">
                  Actual Balance
                </h4>
                <i className="fa-solid fa-wallet text-black text-[17px]"></i>
              </div>
              <hr className="border border-wallet-summary-hr border-l-0 border-r-0 border-t-0 mb-3" />
              <h3 className="font-semibold text-xl text-primary-800">
                &#8358;
                {balance ??
                  (200000.0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </h3>
              <hr className="border border-wallet-summary-hr border-l-0 border-r-0 border-t-0 mt-3 mb-2" />

              <div className="inline-flex flex-row gap-x-5 items-center">
                <i className="fa-solid fa-building-columns text-lg text-black"></i>
                <div className="inline-flex flex-row gap-x-3 items-center">
                  <h4 className="text-sm font-medium inline-flex xl:flex-row flex-row items-center lg:flex-col lg:items-start xl:items-center">
                    <span>Wema Bank&nbsp;&nbsp;</span>
                    <span>010&nbsp;011&nbsp;2998</span>
                  </h4>
                  <i className="fa-regular fa-copy text-lg text-black"></i>
                </div>
              </div>
            </div>
            <hr className="border-t border-dotted border-primary-200 border-l-0 border-r-0 border-b-0 my-7" />
            <div className="inline-flex flex-col gap-y-4 xl:px-6 px-6 lg:px-4">
              <div className="inline-flex flex-row items-center justify-between">
                <h4 className="font-medium text-[12px] text-primary-400">
                  Pending Amount
                </h4>
                <i className="fa-regular fa-clock text-black text-[17px]"></i>
              </div>
              <hr className="border border-wallet-summary-hr border-l-0 border-r-0 border-t-0 mb-3" />
              <h3 className="font-semibold text-xl text-primary-800">
                &#8358;
                {(0.0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </article>
          <div className="flex flex-col gap-y-3 w-full text-[10px] font-medium">
            <div className="inline-flex flex-row w-full gap-x-3">
              <button
                type="button"
                onClick={showAddFundsModalHandler}
                id="toggle-add-funds"
                data-testid="toggle-add-funds"
                className="w-[50%] shadow-lg bg-secondary-400 px-5 py-2 rounded-md cursor-pointer"
              >
                Add Funds
              </button>
              <button
                id="toggle-withdraw"
                type="button"
                data-testid="withdraw"
                onClick={() => showTransferModalHandler("Withdraw")}
                className="w-[50%] text-primary-400 border border-primary-100 rounded-md cursor-pointer"
              >
                Withdrawal
              </button>
            </div>
            <div className="inline-flex xl:flex-row flex-row lg:flex-col gap-y-3 w-full gap-x-3">
              <button
                onClick={() => showTransferModalHandler("Transfer")}
                className="xl:w-[33.3%] w-[33.3%] text-primary-400 border border-primary-100 px-5 py-2 rounded-md lg:w-full cursor-pointer"
              >
                Transfer
              </button>
              <button className="xl:w-[33.3%] w-[33.3%] text-primary-400 border border-primary-100 px-5 py-2 rounded-md lg:w-full cursor-pointer">
                Place Lien
              </button>
              <button className="xl:w-[33.3%] w-[33.3%] text-primary-400 border border-primary-100 px-5 py-2 rounded-md lg:w-full cursor-pointer">
                Freeze Wallet
              </button>
            </div>
          </div>
        </div>
        <span className="h-screen xl:mx-[22px] mx-[10px] bg-primary-200 w-px lg:block hidden"></span>
        <hr className="border border-primary-200 border-l-0 border-r-0 border-t-0 lg:hidden" />
        <div
          className="
        flex flex-col md:items-start items-center xl:w-[62%] lg:w-[78%] w-full gap-y-2"
          style={{
            height: `${
              trans.length === 0
                ? 300
                : (trans.length < ITEMS_PER_PAGE
                    ? trans.length
                    : ITEMS_PER_PAGE) *
                    110 <=
                  400
                ? (trans.length < ITEMS_PER_PAGE
                    ? trans.length
                    : ITEMS_PER_PAGE) * 110
                : 500
            }px`,
          }}
        >
          {trans.length > 0 && (
            <div className="flex flex-col gap-y-5 w-full h-20%]">
              <h3 className="text-wallet-history-header-color font-semibold text-[16px]">
                Transaction History
              </h3>
              <div className="inline-flex lg:flex-row md:flex-row lg:justify-between md:justify-between flex-col gap-y-5 lg:gap-y-0 md:gap-y-0 items-center w-full">
                <div className="inline-flex flex-row flex-wrap gap-y-3 lg:gap-y-0 items-start lg:items-center xl:gap-x-2 gap-x-1">
                  <button className="border cursor-pointer border-primary-100 text-wallet-history-header-secondary-text rounded-md font-medium text-sm px-5 py-1">
                    3 years
                  </button>
                  <button className="border cursor-pointer border-primary-100 text-wallet-history-header-secondary-text rounded-md font-medium text-sm px-5 py-1">
                    Approved
                  </button>
                  <button className="border cursor-pointer border-primary-100 text-wallet-history-header-secondary-text rounded-md font-medium text-sm px-5 py-1">
                    Pending
                  </button>
                  <button
                    className={`border cursor-pointer border-primary-800 bg-wallet-history-header-secondary-active text-primary-800 rounded-md font-medium text-sm px-5 py-1`}
                  >
                    History
                  </button>
                </div>
                <div className="inline-flex flex-row items-center gap-x-2 text-sm font-medium">
                  <h5 className="text-wallet-history-header-secondary-text">
                    AddFunds by
                  </h5>
                  <div className="relative inline-block w-20">
                    <select
                      className={`border focus:outline-none appearance-none border-primary-100 cursor-pointer shadow-none w-full text-wallet-history-header-secondary-text rounded-md px-5 py-1`}
                    >
                      <option hidden>Spot</option>
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      {/* Replace with your angle-down icon */}
                      <i className="fa-solid fa-angle-down text-wallet-history-header-secondary-text"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="w-full h-full relative font-inter">
            {trans.length > 0 && (
              <div className="w-full absolute top-[24px]">
                <div className="h-8 border border-primary-100 border-l-0 border-r-0"></div>
              </div>
            )}
            <div>
              {trans.length > 0 &&
                dividerPositions.map((position, index) => (
                  <div
                    key={index}
                    className={`w-full absolute`}
                    style={{ top: position.top }}
                  >
                    <div className="h-8 border border-primary-100 border-l-0 border-r-0 border-t-0"></div>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full h-full -ml-5 font-inter flex flex-col justify-center h-[60%]">
            {trans.length === 0 ? (
              <div className="w-full h-full flex flex-col justify-center items-center font-inter gap-y-2">
                <i className="fa-regular fa-face-sad-tear text-5xl text-secondary-400"></i>
                <h2 className="text-primary-800 text-sm">
                  Start a transaction..
                </h2>
              </div>
            ) : (
              <Swiper
                spaceBetween={windowWidth < 768 ? -21 : 30}
                slidesPerView={windowWidth < 768 ? 3 : 4}
                autoHeight
                className="w-full h-full" // add some horizontal padding
                centeredSlides={false} // make sure it's off
              >
                <SwiperSlide className="md:!w-[22%] !w-[40%] !h-[620px]">
                  <article className="flex flex-col gap-y-3 p-6 h-full w-full">
                    <header className="w-full">
                      <ul className="flex flex-row font-medium text-[12px] w-full text-primary-800">
                        {articleHeaderTemplate("w-full", `${ windowWidth < 576 ? 'Trans ID' : 'Transaction ID'}`)}
                      </ul>
                    </header>
                    <ul className="flex flex-col font-normal text-[11px] text-wallet-history-item">
                      {visibleTrans.map((trans, i) => {
                        return (
                          <ul
                            key={i}
                            className={`flex flex-row items-center w-full py-4`}
                          >
                            <li className="w-full">
                              <h5 className="text-start">{trans.id}</h5>
                            </li>
                          </ul>
                        );
                      })}
                    </ul>
                  </article>
                </SwiperSlide>
                <SwiperSlide className="md:!w-[24%] !w-[44%] !h-[620px]">
                  <article className="flex flex-col gap-y-3 p-6 h-full w-full">
                    <header className="w-full">
                      <ul className="flex flex-row font-medium text-[12px] w-full text-primary-800">
                        {articleHeaderTemplate(
                          "w-full",
                          `${
                            windowWidth < 567
                              ? "Trans Type"
                              : "Transaction Type"
                          }`
                        )}
                      </ul>
                    </header>
                    <ul className="flex flex-col font-normal text-[11px] text-wallet-history-item">
                      {visibleTrans.map((trans, i) => {
                        return (
                          <ul
                            key={i}
                            className={`flex flex-row items-center w-full py-4`}
                          >
                            <li className="w-full">
                              <h5 className="text-start">
                                {trans.trans_type.split(" ").length > 1
                                  ? trans.trans_type
                                      .split(" ")[0][0]
                                      .toUpperCase() +
                                    trans.trans_type.split(" ")[0].slice(1) +
                                    " " +
                                    (trans.trans_type
                                      .split(" ")[1][0]
                                      .toUpperCase() +
                                      trans.trans_type.split(" ")[1].slice(1))
                                  : trans.trans_type[0].toUpperCase() +
                                    trans.trans_type.slice(1)}
                              </h5>
                            </li>
                          </ul>
                        );
                      })}
                    </ul>
                  </article>
                </SwiperSlide>
                <SwiperSlide className="md:!w-[22%] !w-[40%] !h-[620px]">
                  <article className="flex flex-col gap-y-3 p-6 h-full w-full">
                    <header className="w-full">
                      <ul className="flex flex-row font-medium text-[12px] w-full text-primary-800">
                        {articleHeaderTemplate("w-full", "Amount (₦)")}
                      </ul>
                    </header>
                    <ul className="flex flex-col font-normal text-[11px] text-wallet-history-item">
                      {visibleTrans.map((trans, i) => {
                        return (
                          <ul
                            key={i}
                            className={`flex flex-row items-center w-full py-4`}
                          >
                            <li className="w-full">
                              <h5 className="text-start">
                                &#8358;
                                {trans.amount.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </h5>
                            </li>
                          </ul>
                        );
                      })}
                    </ul>
                  </article>
                </SwiperSlide>
                <SwiperSlide className="md:!w-[22%] !w-[40%] !h-[620px]">
                  <article className="flex flex-col gap-y-3 p-6 h-full w-full">
                    <header className="w-full">
                      <ul className="flex flex-row font-medium text-[12px] w-full text-primary-800">
                        {articleHeaderTemplate("w-full", `Status`)}
                      </ul>
                    </header>
                    <ul className="flex flex-col font-normal text-[11px] text-wallet-history-item">
                      {visibleTrans.map((trans, i) => {
                        return (
                          <ul
                            key={i}
                            className={`flex flex-row items-center w-full py-4`}
                          >
                            <li className="w-full inline-flex flex-row gap-x-2 items-center">
                              <i
                                className={`${
                                  trans.status === "approved"
                                    ? "text-status-success"
                                    : "text-status-deduct"
                                } text-[8px] fa-solid fa-circle`}
                              ></i>
                              <h5 className="text-start">
                                {trans.status[0].toUpperCase() +
                                  trans.status.slice(1)}
                              </h5>
                            </li>
                          </ul>
                        );
                      })}
                    </ul>
                  </article>
                </SwiperSlide>
                <SwiperSlide className="md:!w-[22%] !w-[36%] !h-[620px]">
                  <article className="flex flex-col gap-y-3 p-6 h-full w-full">
                    <header className="w-full">
                      <ul className="flex flex-row font-medium text-[12px] w-full text-primary-800">
                        {articleHeaderTemplate("w-full", "Date")}
                      </ul>
                    </header>
                    <ul className="flex flex-col font-normal text-[11px] text-wallet-history-item">
                      {visibleTrans.map((trans, i) => {
                        return (
                          <ul
                            key={i}
                            className={`flex flex-row items-center w-full py-4`}
                          >
                            <li className="w-full">
                              <h5 className="text-start">
                                {" "}
                                {
                                  new Date(trans.date)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </h5>
                            </li>
                          </ul>
                        );
                      })}
                    </ul>
                  </article>
                </SwiperSlide>
                <SwiperSlide className="md:!w-[22%] !w-[40%] !h-[620px]">
                  <article className="flex flex-col gap-y-3 p-6 h-full w-full">
                    <header className="w-full">
                      <ul className="flex flex-row font-medium text-[12px] w-full text-primary-800">
                        {articleHeaderTemplate("w-full", "Action")}
                      </ul>
                    </header>

                    <ul className="font-medium text-wallet-history-view text-[11px]">
                      {visibleTrans.map((_, i) => {
                        return (
                          <ul
                            key={i}
                            className={`flex flex-row items-center w-full py-[10.9px]`}
                          >
                            <li className="w-full">
                              <button
                                onClick={() =>
                                  selectedTransId &&
                                  openDetailsPage(selectedTransId)
                                }
                                className="border border-primary-100 rounded-md px-4 py-1 cursor-pointer"
                              >
                                View
                              </button>
                            </li>
                          </ul>
                        );
                      })}
                    </ul>
                  </article>
                </SwiperSlide>
              </Swiper>
            )}
          </div>
          {trans.length > 0 && (
            <PaginationComponent
              count={count}
              setCurrentPage={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={trans.length}
              hasPreviousPage={data.hasPreviousPage}
              currentPage={data.currentPage}
              hasNextPage={data.hasNextPage}
              lastPage={data.lastPage}
              nextPage={data.nextPage}
              previousPage={data.previousPage}
              isActivePage={data.isActivePage}
              setVisibleTrans={setVisibleTrans}
              setCount={setCount}
              trans={trans}
              setDividerPositions={setDividerPositions}
            />
          )}
        </div>
        <p data-testid="slide-index" className="hidden">
          Current slide: {activeIndex}
        </p>

      </div>
        <hr className="border border-primary-200 border-l-0 border-r-0 border-b-0 w-full lg:mt-4 xl:mt-0 lg:block hidden" />
      {isAddFundsModalOpen && (
        <AddFundsModal onClose={() => {}}>
          <div
            className={`w-full ${
              activeIndex === 0 ? "h-[384px]" : "h-[500px]"
            }`}
          >
            <Swiper
              slidesPerView={1}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="w-full h-full"
              allowTouchMove={false}
            >
              <SwiperSlide>
                <form className="flex flex-col gap-y-4 text-primary-400 items-start font-medium text-[16px] w-full h-full pb-3 font-inter">
                  <div className="flex flex-row justify-between items-center w-full px-6">
                    <h3 className="font-inter font-semibold text-lg text-black w-full">
                      Payment Option
                    </h3>
                    <i
                      className="fa-solid fa-xmark text-xl cursor-pointer text-black"
                      onClick={() =>
                        hideModalHandler("add-funds", setIsAddFundsModalOpen)
                      }
                    ></i>
                  </div>
                  <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr w-full" />
                  <div className="flex flex-col px-6 w-full gap-y-4 mt-4">
                    <div
                      className={`flex flex-row items-center w-full justify-between border ${
                        selectedOption === "bank"
                          ? "border-primary-850"
                          : "border-primary-200"
                      } p-4 rounded-xl`}
                    >
                      <div className="inline-flex flex-row items-center gap-x-3">
                        <i
                          className={`fa-solid fa-building-columns text-[20px] ${
                            selectedOption === "bank"
                              ? "text-primary-850"
                              : "text-primary-400"
                          }`}
                        ></i>
                        <h4
                          className={`${
                            selectedOption === "bank"
                              ? "text-primary-850"
                              : "text-primary-400"
                          } text-base font-semibold`}
                        >
                          Bank Transfer
                        </h4>
                      </div>

                      <input
                        type="radio"
                        value="bank"
                        checked={selectedOption === "bank"}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="cursor-pointer border border-primary-300 checked:bg-primary-850 checked:border-primary-850"
                      />
                    </div>
                    <div
                      className={`flex flex-row items-center w-full justify-between border ${
                        selectedOption === "card"
                          ? "border-primary-850"
                          : "border-primary-200"
                      } p-4 rounded-xl`}
                    >
                      <div className="inline-flex flex-row items-center gap-x-3">
                        <i
                          className={`fa-solid fa-credit-card text-[20px] ${
                            selectedOption === "bank"
                              ? "text-primary-850"
                              : "text-primary-400"
                          }`}
                        ></i>

                        <h4
                          className={`${
                            selectedOption === "card"
                              ? "text-primary-850"
                              : "text-primary-400"
                          } text-base font-semibold`}
                        >
                          Add {windowWidth < 768 ? "" : "Debit/Credit"} Card
                        </h4>
                      </div>

                      <input
                        type="radio"
                        value="card"
                        checked={selectedOption === "card"}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="cursor-pointer border border-primary-300 checked:bg-primary-850 checked:border-primary-850"
                      />
                    </div>
                    <div className={`p-4`}>
                      <div className="inline-flex flex-row items-center gap-x-3">
                        <i
                          className={`fa-solid fa-circle-plus text-[20px] text-primary-400`}
                        ></i>

                        <h4
                          className={`text-primary-400 text-base font-semibold`}
                        >
                          Add Payment Method
                        </h4>
                      </div>
                    </div>
                    <button
                      disabled={buttonDisabled}
                      type="button"
                      className={`${
                        buttonDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:ring-1 ring-secondary-400"
                      }  mt-5 w-full text-black text-[16px] font-semibold border border-secondary-400 rounded-md py-3 bg-secondary-400`}
                      onClick={() => {
                        goToSlide(1);
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </SwiperSlide>
              <SwiperSlide>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      setIsLoading(true);

                      const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/wallet/fund`,
                        {
                          card_no: cardNo,
                          cvv,
                          card_expiry_date: exp,
                          trans_type: "deposit",
                          amount,
                          status: "pending",
                          date: new Date().toISOString(),
                        },
                        {
                          withCredentials: true,
                        }
                      );

                      if (res.data.message === "success") {
                        setBalance(res.data.user.wallet.balance);
                        setCVV(res.data.user.bank.cvv);
                        setCardNo(res.data.user.bank.card_no);
                        setExp(res.data.user.bank.card_expiry_date);
                        setCount(
                          res.data.transactions.length < ITEMS_PER_PAGE
                            ? res.data.transactions.length
                            : ITEMS_PER_PAGE
                        );
                        setVisibleTrans(
                          res.data.transactions.slice(0, ITEMS_PER_PAGE)
                        );
                        setDividerPositions(
                          [
                            { top: "72px" },
                            { top: "120px" },
                            { top: "168px" },
                            { top: "216px" },
                            { top: "264px" },
                            { top: "312px" },
                            { top: "360px" },
                            { top: "408px" },
                            { top: "456px" },
                          ].slice(
                            0,
                            res.data.transactions.length < ITEMS_PER_PAGE
                              ? res.data.transactions.length
                              : ITEMS_PER_PAGE
                          )
                        );
                        setTrans(res.data.transactions);
                        setSelectedOption("");
                        setAmount(0);
                        setIsLoading(false);
                        hideModalHandler("add-funds", setIsAddFundsModalOpen);
                      }
                    } catch (error) {
                      const e = error as Error;
                      setIsLoading(false);
                      return toast.error(e.message);
                    }
                  }}
                  className="flex flex-col gap-y-4 text-primary-400 items-start font-medium text-[16px] font-inter w-full h-full pb-3"
                >
                  <div className="inline-flex flex-col items-start gap-y-0 font-inter px-6">
                    <h3 className="font-semibold md:text-[24px] text-[18px] text-black">
                      Payment Details
                    </h3>
                    <h4 className="font-normal md:text-[18px] text-[16px] text-auth">
                      Please confirm the margin details
                    </h4>
                  </div>
                  <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr w-full" />
                  <div className="flex flex-col items-start w-full px-6 mt-2">
                    <label>Amount</label>
                    <div className="inline-block relative w-full">
                      <select
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="cursor-pointer w-full placeholder:primary-200 appearance-none focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                      >
                        <option value="" hidden unselectable="on">
                          Select Amount
                        </option>
                        <option value="100">{(100).toLocaleString()}</option>
                        <option value="300">{(300).toLocaleString()}</option>
                        <option value="500">{(500).toLocaleString()}</option>
                        <option value="1000">{(1000).toLocaleString()}</option>
                        <option value="5000">{(5000).toLocaleString()}</option>
                        <option value="10000">
                          {(10000).toLocaleString()}
                        </option>
                        <option value="100000">
                          {(100000).toLocaleString()}
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        {/* Replace with your angle-down icon */}
                        <i className="fa-solid fa-angle-down text-wallet-history-header-secondary-text"></i>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full px-6">
                    <label>Card Details</label>
                    <div className="w-full focus-within:border h-10 focus-within:border-primary-200 pr-4 text-sm border border-primary-400/20 py-2 flex flex-row items-center bg-transparent rounded-md justify-between">
                      <input
                        type="text"
                        value={cardNo}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                          setCardNo(value);
                          const detectedIssuer = detectIssuer(value);
                          setIssuer(detectedIssuer);
                        }}
                        placeholder="5399"
                        className="w-full placeholder:primary-200 focus:outline-none bg-transparent placeholder:font-inter placeholder:font-normal px-3 py-2"
                      />
                      {issuer === "MasterCard" ? (
                        <Image
                          width={28}
                          height={24}
                          src={mastercardLogo}
                          alt="card"
                        />
                      ) : (
                        <Image
                          width={28}
                          height={24}
                          src={visaLogo}
                          alt="card"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full px-6">
                    <label>Expiry date</label>
                    <input
                      type="date"
                      value={exp}
                      onChange={(e) => setExp(e.target.value)}
                      className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                    />
                  </div>
                  <div className="flex flex-col items-start w-full px-6">
                    <label>CVV</label>
                    <input
                      type="text"
                      onChange={(e) => setCVV(e.target.value)}
                      value={cvv}
                      placeholder="546"
                      className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                    />
                  </div>
                  <div className="inline-block w-full px-6 mt-5">
                    <button
                      type="submit"
                      className="cursor-pointer w-full text-black text-[16px] font-semibold border border-secondary-400 hover:ring-1 ring-secondary-400 rounded-md py-3 bg-secondary-400"
                    >
                      {isLoading ? "Processing" : "Pay Now"}
                    </button>
                  </div>
                </form>
              </SwiperSlide>
            </Swiper>
          </div>
        </AddFundsModal>
      )}

      {isTransferModalOpen && (
        <TransferModal
          onClose={() => hideModalHandler("transfer", setIsTransferModalOpen)}
        >
          <div
            className={`w-full ${
              transferModalHeader === "Withdraw" && activeIndex === 0
                ? "h-[239px]"
                : transferModalHeader === "Withdraw" && activeIndex > 0
                ? "md:h-[484px] h-[478px]"
                : transferModalHeader === "Transfer" && activeIndex === 0
                ? "h-[416px]"
                : "md:h-[484px] h-[478px]"
            }`}
          >
            <Swiper
              slidesPerView={1}
              allowTouchMove={false}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="w-full h-full"
            >
              <SwiperSlide>
                <form className="flex flex-col gap-y-4 text-primary-400 font-medium text-[16px] font-inter w-full h-full pb-3">
                  <div className="flex flex-row justify-between items-center w-full px-6">
                    <h3 className="font-inter font-semibold text-lg text-black w-full">
                      {transferModalHeader} Details
                    </h3>
                    <i
                      className="fa-solid fa-xmark text-xl cursor-pointer text-black"
                      onClick={() =>
                        hideModalHandler("transfer", setIsTransferModalOpen)
                      }
                    ></i>
                  </div>
                  <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr w-full" />
                  <div className="flex flex-col px-6 w-full gap-y-4 mt-4">
                    {transferModalHeader === "Transfer" && (
                      <div className="flex flex-col items-start w-full">
                        <label>Email</label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="test@test.com"
                          className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-start w-full">
                      <label>Amount</label>
                      <div className="inline-block relative w-full">
                        <select
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="cursor-pointer w-full placeholder:primary-200 appearance-none focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                        >
                          <option value="" hidden unselectable="on">
                            Select Amount
                          </option>
                          <option value="100">{(100).toLocaleString()}</option>
                          <option value="300">{(300).toLocaleString()}</option>
                          <option value="500">{(500).toLocaleString()}</option>
                          <option value="1000">
                            {(1000).toLocaleString()}
                          </option>
                          <option value="5000">
                            {(5000).toLocaleString()}
                          </option>
                          <option value="10000">
                            {(10000).toLocaleString()}
                          </option>
                          <option value="100000">
                            {(100000).toLocaleString()}
                          </option>
                        </select>
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          {/* Replace with your angle-down icon */}
                          <i className="fa-solid fa-angle-down text-wallet-history-header-secondary-text"></i>
                        </div>
                      </div>
                    </div>
                    {transferModalHeader === "Transfer" && (
                      <div className="flex flex-col items-start w-full">
                        <label>Note</label>
                        <textarea
                          onChange={(e) => setNote(e.target.value)}
                          value={note}
                          placeholder="Give a description to classify the transfer.."
                          className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                        ></textarea>
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={buttonDisabled}
                      onClick={() => {
                        goToSlide(1);
                      }}
                      className={`${
                        buttonDisabled
                          ? "cursor-not-allowed"
                          : "cursor-pointer hover:ring-1 ring-secondary-400"
                      } w-full mt-9 w-full text-black text-[16px] font-semibold border border-secondary-400 rounded-md py-3 bg-secondary-400`}
                    >
                      Continue
                    </button>
                  </div>
                </form>
              </SwiperSlide>
              <SwiperSlide>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      setIsLoading(true);
                      const operation =
                        amount > 0 && note.length === 0 && email.length === 0
                          ? "withdraw"
                          : "transfer";
                      const res = await axios.post(
                        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/wallet/${operation}`,
                        {
                          card_no: cardNo,
                          cvv,
                          card_expiry_date: exp,
                          amount,
                          note,
                          email,
                          trans_type: operation,
                          status: "approved",
                          date: new Date().toISOString(),
                        },
                        {
                          withCredentials: true,
                        }
                      );

                      if (res.data.message === "success") {
                        setBalance(res.data.user.wallet.balance);
                        setCVV(res.data.user.bank.cvv);
                        setCardNo(res.data.user.bank.card_no);
                        setExp(res.data.user.bank.card_expiry_date);
                        setCount(
                          res.data.transactions.length < ITEMS_PER_PAGE
                            ? res.data.transactions.length
                            : ITEMS_PER_PAGE
                        );
                        setVisibleTrans(
                          res.data.transactions.slice(0, ITEMS_PER_PAGE)
                        );
                        setDividerPositions(
                          [
                            { top: "72px" },
                            { top: "120px" },
                            { top: "168px" },
                            { top: "216px" },
                            { top: "264px" },
                            { top: "312px" },
                            { top: "360px" },
                            { top: "408px" },
                            { top: "456px" },
                          ].slice(
                            0,
                            res.data.transactions.length < ITEMS_PER_PAGE
                              ? res.data.transactions.length
                              : ITEMS_PER_PAGE
                          )
                        );
                        setTrans(res.data.transactions);
                        setSelectedOption("");
                        setAmount(0);
                        setIsLoading(false);
                        hideModalHandler(operation, setIsTransferModalOpen);
                      }
                    } catch (error) {
                      const e = error as Error;
                      setIsLoading(false);
                      return toast.error(e.message);
                    }
                  }}
                  className="flex flex-col gap-y-4 text-primary-400 items-start font-medium text-[16px] font-inter w-full h-full pb-3"
                >
                  <div className="inline-flex flex-col items-start gap-y-0 font-inter px-6">
                    <h3 className="font-semibold md:text-[24px] text-[18px] text-black">
                      {transferModalHeader === "Transfer"
                        ? "Transfer"
                        : "Withdraw"}{" "}
                      Details
                    </h3>
                    <h4 className="font-normal md:text-[18px] text-[16px] text-auth">
                      Please confirm the margin details
                    </h4>
                  </div>
                  <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr w-full" />
                  <div className="flex flex-col items-start w-full px-6 mt-2">
                    <label>Amount</label>
                    <div className="inline-block relative w-full">
                      <select
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="cursor-pointer w-full placeholder:primary-200 appearance-none focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                      >
                        <option value="" hidden unselectable="on">
                          Select Amount
                        </option>
                        <option value="100">{(100).toLocaleString()}</option>
                        <option value="300">{(300).toLocaleString()}</option>
                        <option value="500">{(500).toLocaleString()}</option>
                        <option value="1000">{(1000).toLocaleString()}</option>
                        <option value="5000">{(5000).toLocaleString()}</option>
                        <option value="10000">
                          {(10000).toLocaleString()}
                        </option>
                        <option value="100000">
                          {(100000).toLocaleString()}
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        {/* Replace with your angle-down icon */}
                        <i className="fa-solid fa-angle-down text-wallet-history-header-secondary-text"></i>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full px-6">
                    <label>Card Details</label>
                    <div className="w-full focus-within:border h-10 focus-within:border-primary-200 pr-4 text-sm border border-primary-400/20 py-2 flex flex-row items-center bg-transparent rounded-md justify-between">
                      <input
                        type="text"
                        value={cardNo}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                          setCardNo(value);
                          const detectedIssuer = detectIssuer(value);
                          setIssuer(detectedIssuer);
                        }}
                        placeholder="5399"
                        className="w-full placeholder:primary-200 focus:outline-none bg-transparent placeholder:font-inter placeholder:font-normal px-3 py-2"
                      />
                      {issuer === "MasterCard" ? (
                        <Image
                          width={28}
                          height={24}
                          src={mastercardLogo}
                          alt="card"
                        />
                      ) : (
                        <Image
                          width={28}
                          height={24}
                          src={visaLogo}
                          alt="card"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start w-full px-6">
                    <label>Expiry date</label>
                    <input
                      type="date"
                      value={exp}
                      onChange={(e) => setExp(e.target.value)}
                      className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                    />
                  </div>
                  <div className="flex flex-col items-start w-full px-6">
                    <label>CVV</label>
                    <input
                      type="text"
                      onChange={(e) => setCVV(e.target.value)}
                      value={cvv}
                      placeholder="546"
                      className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                    />
                  </div>
                  <div className="inline-block w-full px-6 mt-5">
                    <button
                      type="submit"
                      className="cursor-pointer w-full text-black text-[16px] font-semibold border border-secondary-400 hover:ring-1 ring-secondary-400 rounded-md px-5 py-3 bg-secondary-400"
                    >
                      {isLoading
                        ? "Processing"
                        : transferModalHeader === "Transfer"
                        ? "Transfer"
                        : "Withdraw"}
                      &nbsp;Now
                    </button>
                  </div>
                </form>
              </SwiperSlide>
            </Swiper>
          </div>
        </TransferModal>
      )}
    </main>
  );
}