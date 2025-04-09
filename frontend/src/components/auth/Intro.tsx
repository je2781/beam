import Image from "next/image";
import Looper from '../../../public/looper_bg.png';
import Logo from '../../../public/logo.png';

export default function Intro() {
  return (
    <article className="lg:w-[25%] xl:w-[30%] h-full bg-primary-850 lg:block hidden fixed left-0 top-0">
      <div className="h-full relative">
        <Image src={Looper} alt="looper image" fill className="object-cover" />
      </div>
      <div className="absolute lg:pl-7 xl:pl-12 pb-14 bottom-0 inline-flex flex-col items-start gap-y-5">
        <Image src={Logo} alt="logo" width={48} height={48} />
        <h1 className="font-inter font-semibold text-white text-3xl">
          Unlock High Returns
          <br />
          with Collateralized
          <br />
          Equity Asset{" "}
        </h1>
        <ul className="inline-flex flex-col gap-y-4 items-start mt-4 w-full pl-0">
          <li className="inline-flex flex-row w-full gap-x-3 items-center">
            <i className="fa-solid w-[7%] fa-scale-balanced text-secondary-400 text-lg"></i>
            <h5 className="font-light w-[93%] text-sm text-white">Collateralized</h5>
          </li>
          <li className="inline-flex flex-row w-full gap-x-3 items-center">
            <i className="fa-solid w-[7%] fa-shield text-secondary-400 text-lg"></i>
            <h5 className="font-light w-[93%] text-sm text-white">Secured</h5>
          </li>
          <li className="inline-flex flex-row w-full gap-x-3 items-center">
            <i className="fa-solid w-[7%] fa-award text-secondary-400 text-lg"></i>
            <h5 className="font-light w-[93%] text-sm text-white">
              Licensed & regulated
            </h5>
          </li>
        </ul>
      </div>
    </article>
  );
}
