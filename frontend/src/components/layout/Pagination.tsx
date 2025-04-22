"use client";

import { PaginationProps } from "@/interfaces/interfaces";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function PaginationComponent({
  count,
  setCount,
  itemsPerPage,
  hasPreviousPage,
  currentPage,
  hasNextPage,
  lastPage,
  nextPage,
  previousPage,
  isActivePage,
  setCurrentPage,
  totalItems,
  setVisibleTrans,
  trans,
  setDividerPositions,
}: PaginationProps) {
  const router = useRouter();
  const path = usePathname();

  //setting limits to items shown
  const [max, setMax] = React.useState<number>(
    trans.length < itemsPerPage ? trans.length : itemsPerPage
  );
  const min = 1;

  return (
    <footer className="flex md:flex-row flex-col items-center text-[12px] font-medium md:justify-between gap-y-7 md:gap-0 md:w-full w-fit h-[20%] font-inter">
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

                  setDividerPositions(
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
                    ].slice(0, newNumber)
                  );
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
                  setDividerPositions(
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
                    ].slice(0, Math.min(count + 1, max))
                  );
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
                  setDividerPositions(
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
                    ].slice(0, Math.max(count - 1, min))
                  );
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
          <Link
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              // Programmatically navigate to the base route (without ?page=1)

              router.push(path);
            }}
            className={`${
              isActivePage === 1
                ? "border border-wallet-pagination-active rounded-md py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            1
          </Link>
        )}
        {hasPreviousPage && previousPage > 1 && previousPage !== 2 && (
          <span className="font-inter text-primary-400/40">...</span>
        )}
        {hasPreviousPage && previousPage > 1 && (
          <Link
            href={`?page=${previousPage}`}
            className={`${
              isActivePage === previousPage
                ? "border border-wallet-pagination-active rounded-md py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            {previousPage}
          </Link>
        )}
        <Link
          href={`?page=${currentPage}`}
          className={`${
            isActivePage === currentPage
              ? "border border-wallet-pagination-active rounded-md py-2 px-3 text-primary-800"
              : "text-wallet-history-header-secondary-text"
          }  font-inter`}
        >
          {currentPage}
        </Link>
        {hasNextPage && nextPage + 3 < lastPage && (
          <span className="font-inter text-primary-400/40">...</span>
        )}
        {hasNextPage && nextPage !== lastPage && (
          <Link
            href={`?page=${nextPage}`}
            className={`${
              isActivePage === nextPage
                ? "border border-wallet-pagination-active rounded-md py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            {lastPage - 1}
          </Link>
        )}
        {lastPage !== currentPage && (
          <Link
            href={`?page=${lastPage}`}
            className={`${
              isActivePage === lastPage
                ? "border border-wallet-pagination-active rounded-md py-2 px-3 text-primary-800"
                : "text-wallet-history-header-secondary-text"
            } font-inter`}
          >
            {lastPage}
          </Link>
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
            } cursor-pointer rounded-md border w-fit h-fit py-3 px-4`}
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
              setDividerPositions(
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
                ].slice(0, visibleTrans.length)
              );
              setCount(visibleTrans.length);
              setMax(visibleTrans.length);
            }}
            className={`${
              currentPage < lastPage
                ? "border-wallet-history-header-secondary-text"
                : "border-primary-100"
            } cursor-pointer rounded-md border w-fit h-fit py-3 px-4`}
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
