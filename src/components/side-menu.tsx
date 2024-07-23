import { UserContextType } from "@/context/UserContext";
import { RpcConnectionDialog } from "@/views/rpc-connection/rpc-connection-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TelegramIcon from "../memechan-ui/icons/telegram-icon.svg";
import TwitterIcon from "../memechan-ui/icons/twitter-icon.svg";

export default function SideMenu(props: { account: UserContextType; disconnect: () => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  return (
    <div className="sm:relative">
      <Popover>
        <Popover.Button onClick={() => setIsOpen(!isOpen)}>
          <div className="max-w-32 w-[137px] h-10 pink-border items-center border-2 border-primary-100 rounded transition-all duration-300 overflow-hidden flex">
            <div
              role="button"
              className="text-primary-100 text-xs font-bold h-full w-full flex justify-evenly items-center bg-inherit transition-colors"
            >
              <span className="flex-1 h-full flex items-center justify-center hover:bg-primary-100 hover:text-white transition-colors">
                {props.account.address.slice(0, 3)}...{props.account.address.slice(-3)}
              </span>
              <span className="h-[90%] border-r border-primary-100"></span>
              <div className="flex items-center justify-center w-10 h-full hover:bg-primary-100 hover:text-white transition-colors">
                {isOpen ? <FontAwesomeIcon icon={faClose} /> : <FontAwesomeIcon icon={faEllipsisV} />}
              </div>
            </div>
          </div>
        </Popover.Button>
        <Popover.Panel className="w-[314px] sm:w-[177px] py-[66px] pr-[104px] pl-8 sm:p-6 sm:pr-2 flex flex-col gap-14 sm:gap-8 sm:rounded-sm border border-mono-400 bg-mono-100 shadow-light top-16 sm:top-12 h-max absolute z-10 right-0">
            <Link href={`/`}>
              <div
                role="button"
                className=" sm:mt-2 text-left bg-dark-background font-bold text-white w-full text-regular text-xs rounded flex items-center space-x-[12px] hover:opacity-80"
              >
                <span>📦</span>
                <span>Home</span>
              </div>
            </Link>
            <Link href={`/profile/${props.account.address}`}>
              <div
                role="button"
                className=" sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
              >
                <span>🤡</span>
                <span>Profile</span>
              </div>
            </Link>
            <RpcConnectionDialog />
            <Link href={`/vesting`}>
              <div
                role="button"
                className=" sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
              >
                <span>🪤</span>
                <span>$CHAN vesting</span>
              </div>
            </Link>
            <Link
              href="https://docs.memechan.gg/"
              className=" sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>🤓</span>
              <span>Docs</span>
            </Link>
            <button
              onClick={() => props.disconnect()}
              className="sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
            >
              <span>🖕</span>
              <span>Disconnect</span>
            </button>
            <div className="bottom-border w-[145px]"/>
            <div className="flex gap-12 sm:gap-4">
              <Image width={24} height={24} src={TwitterIcon} alt="twitter" className="m-[6px] sm:p-1 sm:mx-[2px] sm:my-0 hover:opacity-80 hover:cursor-pointer"/>
              <Image width={24} height={24} src={TelegramIcon} alt="telegram" className="m-[6px] sm:p-1 sm:mx-[2px] sm:my-0 hover:opacity-80 hover:cursor-pointer"/>
            </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
