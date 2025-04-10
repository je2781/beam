import ReactDOM from "react-dom";
import React from "react";
import {
  BackDropProps,
  AddFundsModalOverlayProps,
  AddFundsModalProps,
  MobileModalOverlayProps,
  MobileModalProps,
  TransferModalOverlayProps,
  TransferModalProps,
} from "@/interfaces";

const BackDrop: React.FC<BackDropProps> = (props) => {
  return (
    <div
      className="w-full h-[100vh] top-0 left-0 fixed bg-black/70 z-30"
      onClick={props.onClick}
    ></div>
  );
};

const MobileModalOverlay: React.FC<MobileModalOverlayProps> = (props) => {
  return (
    <main
      id="mobile-nav"
      aria-orientation="vertical"
      aria-labelledby="toggle-button"
      className={`${
        props.classes ? props.classes : "bg-primary-850 pt-[70px]"
      } z-[45] px-3 w-4/5 flex-col pb-12 gap-y-12 h-screen items-center flex fixed top-0 left-0 overflow-y-auto scrollbar-hidden hover:scrollbar-hover`}
    >
      {props.children}
      <i
        className="fa-solid fa-xmark text-xl absolute right-4 top-5 cursor-pointer text-gray-500"
        onClick={props.onClick}
      ></i>
    </main>
  );
};

export const MobileModal: React.FC<MobileModalProps> = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop onClick={props.onClose} />,
        document.getElementById("backdrop-root")!
      )}
      {ReactDOM.createPortal(
        <MobileModalOverlay onClick={props.onClose} classes={props.classes}>
          {props.children}
        </MobileModalOverlay>,
        document.getElementById("mobile-modal")!
      )}
    </>
  );
};

const AddFundsModalOverlay: React.FC<AddFundsModalOverlayProps> = (props) => {
  return (
    <main
      id="add-funds"
      aria-orientation="vertical"
      aria-labelledby="toggle-add-funds"
      className="z-50 bg-white lg:w-[40%] lg:left-[30%] w-[80%] left-[10%] flex-col shadow-xl flex pt-4 fixed top-[15vh] h-fit rounded-2xl"
    >
      {props.children}
    </main>
  );
};

export const AddFundsModal: React.FC<AddFundsModalProps> = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop onClick={props.onClose} />,
        document.getElementById("backdrop-root")!
      )}
      {ReactDOM.createPortal(
        <AddFundsModalOverlay onClick={props.onClose}>
          {props.children}
        </AddFundsModalOverlay>,
        document.getElementById("add-funds-modal")!
      )}
    </>
  );
};

const TransferModalOverlay: React.FC<TransferModalOverlayProps> = (props) => {
  return (
    <main
      id="transfer"
      aria-orientation="vertical"
      aria-labelledby="toggle-transfer"
      className={`z-50 bg-white lg:w-[40%] lg:left-[30%] w-[80%] left-[10%] flex-col shadow-xl flex pb-4 pt-14 fixed top-[15vh] ${props.title === 'Transfer' ? 'md:h-[442px] h-[65vh]' : 'md:h-[260px] h-[65vh]'} rounded-2xl`}
    >
      {props.children}
      <h3 className="font-inter font-semibold text-lg text-black absolute left-6 top-5">
        {props.title} Details
      </h3>
      <i
        className="fa-solid fa-xmark text-xl cursor-pointer text-black absolute top-6 right-6"
        onClick={props.onClick}
      ></i>
      <hr className="border border-l-0 border-r-0 border-t-0 border-modal-hr left-0 right-0 absolute top-16" />
    </main>
  );
};

export const TransferModal: React.FC<TransferModalProps> = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop onClick={props.onClose} />,
        document.getElementById("backdrop-root")!
      )}

      {ReactDOM.createPortal(
        <TransferModalOverlay
          onClick={props.onClose}
          styleClasses={props.styleClasses}
          title={props.title}
        >
          {props.children}
        </TransferModalOverlay>,
        document.getElementById("transfer-modal")!
      )}
    </>
  );
};

