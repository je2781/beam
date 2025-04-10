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

export default function Content({ data }: any) {
  const positions = [
    { top: "65px" },
    { top: "113px" },
    { top: "161px" },
    { top: "209px" },
    { top: "257px" },
    { top: "305px" },
    { top: "353px" },
    { top: "401px" },
    { top: "449px" },
  ];
  let timerId: NodeJS.Timeout | null = null;

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
  const [cvv, setCVV] = React.useState("");
  const [cardNo, setCardNo] = React.useState("");
  const [exp, setExp] = React.useState("");
  const [transferModalHeader, setTransferModalHeader] = React.useState(
    "Withdraw"
  );
  const [trans, setTrans] = React.useState<any[]>(data.transactions);
  const [balance, setBalance] = React.useState<number | null>(null);
  const windowWidth = useWindowWidth();
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const swiperRef = React.useRef<SwiperType>(null);

  const goToSlide = (index: number) => {
    swiperRef.current?.slideTo(index); // jump to a specific slide
    setActiveIndex(index);
  };

  //retrieving ui details
  React.useEffect(() => {
    async function getTransactions(){
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/transactions`,
        {
          withCredentials: true
          
        });
        if(result.data.transactions.length > 0){
          setTrans(result.data.transactions);
        }
      } catch (error) {
        return toast.error('failed to retrieve transactions');
      }
    }
    async function getWalletBalance(){
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/wallet/balance`,{
          withCredentials: true
        });
        if(result.data.message === 'success'){
          setBalance(result.data.wallet_balance);
        }
      } catch (error) {
        return toast.error('failed to retrieve balance');
      }
    }

    getTransactions();
    getWalletBalance();
  }, []);

  React.useEffect(() => {
    if (selectedOption.length > 0 || amount > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [setButtonDisabled, selectedOption, amount]);

  //limiting the max number of items shown per page
  const ITEMS_PER_PAGE = 9;
  const [count, setCount] = React.useState<number>(ITEMS_PER_PAGE);
  const [visibleTrans, setVisibleTrans] = React.useState<Array<any>>(
    trans.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      ITEMS_PER_PAGE * currentPage
    )
  );

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
        {data.sectionName[0].toUpperCase() + data.sectionName.slice(1)}
      </header>
      <hr className="border border-primary-200 border-l-0 border-r-0 border-t-0" />

      <div className="flex lg:flex-row flex-col gap-y-6 lg:gap-y-0 w-full lg:pr-3 xl:pr-0">
        <div className="flex flex-col gap-y-5 xl:w-[36%] lg:w-[23%] w-full">
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
                {balance ?? (200000.0).toLocaleString("en-US", {
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
                onClick={() => showTransferModalHandler('Withdraw')}
                className="w-[50%] text-primary-400 border border-primary-100 rounded-md cursor-pointer"
              >
                Withdrawal
              </button>
            </div>
            <div className="inline-flex xl:flex-row flex-row lg:flex-col gap-y-3 w-full gap-x-3">
              <button
                onClick={() => showTransferModalHandler('Transfer')}
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
        <div className="border-2 border-primary-200 border-b-0 w-2 border-r-0 border-t-0 rotate-180 h-full mx-3" />
        <div className="flex flex-col md:items-start items-center xl:w-[64%] lg:w-[77%] w-full h-[500px] gap-y-2">
          <div className="flex flex-col gap-y-5 w-full">
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
          <div className="w-full h-full font-inter relative">
            <div className="w-full absolute top-[17px]">
              <div className="h-8 border border-primary-100 border-l-0 border-r-0"></div>
            </div>
            <div>
              {positions.map((position, index) => (
                <div
                  key={index}
                  className={`w-full absolute`}
                  style={{ top: position.top }}
                >
                  <div className="h-8 border border-primary-100 border-l-0 border-r-0 border-t-0"></div>
                </div>
              ))}
            </div>
            <div className="w-full -ml-5">
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
                        {articleHeaderTemplate("w-full", "Transaction ID")}
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
                              <h5 className="text-start">{trans.trans_id}</h5>
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
            </div>
          </div>
          <PaginationComponent
            count={count}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={trans.length}
            setVisibleTrans={setVisibleTrans}
            setCount={setCount}
            trans={trans}
          />
        </div>
        <p data-testid="slide-index" className="hidden">
          Current slide: {activeIndex}
        </p>

        {isAddFundsModalOpen && (
          <AddFundsModal onClose={() => {}}>
            <div className="w-full h-full">
              <Swiper
                slidesPerView={1}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="w-full h-full"
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
                        }  mt-5 w-full text-black text-[16px] font-semibold border border-secondary-400 rounded-md px-5 py-3 bg-secondary-400`}
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
                          `${process.env.NNEXT_PUBLIC_SERVER_DOMAIN}/wallet/fund`,
                          {
                            card_no: cardNo,
                            amount,
                            cvv,
                            trans_type: "deposit",
                            status: "pending",
                            date: new Date().toISOString(),
                          }
                        );

                        if (res.data.message === "success") {
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
                      <h3 className="font-semibold text-[24px] text-black">
                        Payment Details
                      </h3>
                      <h4 className="font-normal text-[18px] text-auth">
                        Please confirm the margin details
                      </h4>
                    </div>
                    <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr w-full" />
                    <div className="flex flex-col items-start w-full px-6 mt-3">
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
            title={transferModalHeader}
            onClose={() => hideModalHandler("transfer", setIsTransferModalOpen)}
          >
            <div className="w-full h-full">
              <Swiper
                slidesPerView={1}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="w-full h-full"
              >
                <SwiperSlide>
                  <form className="flex flex-col gap-y-4 text-primary-400 font-medium text-[16px] font-inter w-full h-full py-8 px-6">
                    {transferModalHeader === "Transfer" && (
                      <div className="flex flex-col items-start w-full">
                        <label>Email</label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          className="w-full placeholder:primary-200 focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                        />
                      </div>
                    )}
                    <div className="flex flex-col items-start w-full">
                      <label>Amount</label>
                      <div className="inline-block relative w-full">
                        <select
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="cursor-pointer w-full placeholder:primary-200 appearance-none focus:outline-none focus:border-primary-200 bg-transparent placeholder:font-inter placeholder:font-normal text-sm px-3 py-2 rounded-md border border-primary-400/20"
                        >
                          <option value={100}>{(100).toLocaleString()}</option>
                          <option value={300}>{(300).toLocaleString()}</option>
                          <option value={500}>{(500).toLocaleString()}</option>
                          <option value={1000}>
                            {(1000).toLocaleString()}
                          </option>
                          <option value={5000}>
                            {(5000).toLocaleString()}
                          </option>
                          <option value={10000}>
                            {(10000).toLocaleString()}
                          </option>
                          <option value={100000}>
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
                      } w-full mt-9 w-full text-black text-[16px] font-semibold border border-secondary-400 rounded-md px-7 py-3 bg-secondary-400`}
                    >
                      Continue
                    </button>
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
                          `${process.env.NNEXT_PUBLIC_SERVER_DOMAIN}/wallet/${operation}`,
                          {
                            card_no: cardNo,
                            amount,
                            note,
                            cvv,
                            email,
                            trans_type: operation,
                            status: "approved",
                            date: new Date().toISOString(),
                          }
                        );

                        if (res.data.message === "success") {
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
                      <h3 className="font-semibold text-[24px] text-black">
                        Payment Details
                      </h3>
                      <h4 className="font-normal text-[18px] text-auth">
                        Please confirm the margin details
                      </h4>
                    </div>
                    <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr w-full" />
                    <div className="flex flex-col items-start w-full px-6 mt-3">
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
                        {isLoading ? "Processing" : "Pay Now"}
                      </button>
                    </div>
                  </form>
                </SwiperSlide>
              </Swiper>
            </div>
          </TransferModal>
        )}
      </div>
    </main>
  );
}
