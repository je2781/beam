"use client";

import { PaginationProps } from "@/interfaces/interfaces";
import React from "react";

export default function PaginationComponent({
  count,
  setCount,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
  setVisibleTrans,
  trans,
}: PaginationProps) {
  //setting limits to items shown
  const [max, setMax] = React.useState<number>(itemsPerPage);
  const min = 1;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = totalItems > currentPage * itemsPerPage;
  const lastPage = Math.ceil(totalItems / itemsPerPage);
  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;
  const isActivePage = currentPage;

  return (
    <footer className="flex lg:flex-row flex-col items-center text-[12px] font-medium lg:justify-between gap-y-7 lg:gap-0 lg:w-full w-fit h-[30px] z-10 font-inter">
      <div className="text-primary-800 inline-flex flex-row items-center gap-x-2 h-full">
        <h6>Showing</h6>
        <div className="inline-flex flex-row items-center gap-x-2 bg-primary-300/10 w-[60px] h-[30px] px-2 rounded-xs">
          <input
            type="text"
            className="focus:outline-none text-primary-300 w-full px-1 py-1"
            value={count}
            onChange={(e) => {
              const value = e.target.value;
              //only allow numbers
              if (/^\d*$/.test(value)) {
                const newNumber = Number(value);
                if (newNumber >= min && newNumber <= max) {
                  //updating user data
                  setVisibleTrans(trans.slice(0, newNumber));

                  setCount(newNumber);
                }
              }
            }}
          />
          <div className="inline-flex flex-col">
            <button
              aria-label="up"
              className="-mb-2"
              onClick={() => {
                if (count <= max) {
                  //updating user data

                  setVisibleTrans(trans.slice(0, Math.min(count + 1, max)));
                  setCount((prev: number) => Math.min(prev + 1, max));
                }
              }}
            >
              <i className="fa-solid fa-angle-up text-primary-500 cursor-pointer"></i>
            </button>
            <button
              aria-label="down"
              onClick={() => {
                if (count >= min) {
                  //updating user data

                  setVisibleTrans(trans.slice(0, Math.max(count - 1, min)));
                  setCount((prev: number) => Math.max(prev - 1, min));
                }
              }}
            >
              <i className="fa-solid fa-angle-down text-primary-500 cursor-pointer"></i>
            </button>
          </div>
        </div>
        <h6>out of {totalItems}</h6>
      </div>
      <div className="no-underline space-x-4 text-center h-full text-wallet-history-header-secondary-text font-normal">
        {currentPage !== 1 && (
          <span
            className={`${
              isActivePage === 1
                ? "border border-wallet-pagination-active rounded-lg py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            1
          </span>
        )}
        {hasPreviousPage && previousPage > 1 && previousPage !== 2 && (
          <span className="font-inter text-primary-400/40">...</span>
        )}
        {hasPreviousPage && previousPage > 1 && (
          <span
            className={`${
              isActivePage === previousPage
                ? "border border-wallet-pagination-active rounded-lg py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            {previousPage}
          </span>
        )}
        <span
          className={`${
            isActivePage === currentPage
              ? "border border-wallet-pagination-active rounded-lg py-2 px-3 text-primary-800"
              : "text-wallet-history-header-secondary-text"
          }  font-inter`}
        >
          {currentPage}
        </span>
        {hasNextPage && nextPage + 3 < lastPage && (
          <span className="font-inter text-primary-400/40">...</span>
        )}
        {hasNextPage && nextPage !== lastPage && (
          <span
            className={`${
              isActivePage === nextPage
                ? "border border-wallet-pagination-active rounded-lg py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            {lastPage - 1}
          </span>
        )}
        {lastPage !== currentPage && (
          <span
            className={`${
              isActivePage === lastPage
                ? "border border-wallet-pagination-active rounded-lg py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            {lastPage}
          </span>
        )}
        <div className="inline-flex flex-row">
          <button
            aria-label="previous"
            disabled={!(currentPage > 0 && currentPage !== 1)}
            onClick={() => {
              const visibleTrans = trans.slice(
                (currentPage - 2) * itemsPerPage,
                itemsPerPage * (currentPage - 1)
              );
              //updating user and page data
              setVisibleTrans(visibleTrans);
              setCurrentPage((prev: number) => prev - 1);
              setMax(visibleTrans.length);
            }}
            className={`${
              currentPage > 0 && currentPage !== 1
                ? "border-wallet-history-header-secondary-text"
                : "border-primary-100"
            } cursor-pointer rounded-lg border w-fit h-fit py-3 px-4`}
          >
            <i
              className={`${
                currentPage > 0 && currentPage !== 1
                  ? "text-primary-800"
                  : "text-primary-100"
              } fa-solid fa-angle-left text-[14px]`}
            ></i>
          </button>

          <button
            aria-label="next"
            disabled={!(currentPage < lastPage)}
            onClick={() => {
              const visibleTrans = trans.slice(
                currentPage * itemsPerPage,
                itemsPerPage * (currentPage + 1)
              );
              //updating user and page data
              setVisibleTrans(visibleTrans);
              setCurrentPage((prev: number) => prev + 1);
              setCount(visibleTrans.length);
              setMax(visibleTrans.length);
            }}
            className={`${
              currentPage < lastPage
                ? "border-wallet-history-header-secondary-text"
                : "border-primary-100"
            } cursor-pointer rounded-lg border w-fit h-fit py-3 px-4`}
          >
            <i
              className={`${
                currentPage < lastPage ? "text-primary-800" : "text-primary-100"
              } fa-solid fa-angle-right text-[14px]`}
            ></i>
          </button>
        </div>
      </div>
    </footer>
  );
}
