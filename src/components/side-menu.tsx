import { UserContextType } from "@/context/UserContext";
import { RpcConnectionDialog } from "@/views/rpc-connection/rpc-connection-dialog";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CloseIcon from "../memechan-ui/icons/close-icon.svg"; // Assuming you have a close icon
import MenuIcon from "../memechan-ui/icons/menu-icon.svg";
import TelegramIcon from "../memechan-ui/icons/telegram-icon.svg";
import TwitterIcon from "../memechan-ui/icons/twitter-icon.svg";

export default function SideMenu(props: { account: UserContextType; disconnect: () => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
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
                <Image src={isOpen ? CloseIcon : MenuIcon} alt="menu icon" />
              </div>
            </div>
          </div>
        </Popover.Button>
        <Popover.Panel className="w-72 pl-6 primary-border right-0 bg-dark p-3 top-20 h-max absolute z-10 flex flex-col sm:w-[177px] left-[-155px] sm:left-auto bg-mono-200">
          <Link href={`/`}>
            <div
              role="button"
              className="mt-14 sm:mt-2 text-left bg-dark-background font-bold text-white w-full text-regular text-xs p-2 hover:text-white rounded flex items-center space-x-[12px]"
            >
              <span>📦</span>
              <span>Home</span>
            </div>
          </Link>
          <Link href={`/profile/${props.account.address}`}>
            <div
              role="button"
              className="mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded flex items-center space-x-[12px]"
            >
              <span>🤡</span>
              <span>Profile</span>
            </div>
          </Link>
          <RpcConnectionDialog />
          <Link href={`/vesting`}>
            <div
              role="button"
              className="mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded flex items-center space-x-[12px]"
            >
              <span>🪤</span>
              <span>$CHAN vesting</span>
            </div>
          </Link>
          <Link
            href="https://docs.memechan.gg/"
            className="mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded flex items-center space-x-[12px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>🤓</span>
            <span>Docs</span>
          </Link>
          <button
            onClick={() => props.disconnect()}
            className="pb-16 bottom-border mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded flex items-center space-x-[12px]"
          >
            <span>🖕</span>
            <span>Disconnect</span>
          </button>
          <div className="my-10 flex justify-start space-x-10">
            <Image width={26} height={26} src={TwitterIcon} alt="twitter" />
            <Image width={26} height={26} src={TelegramIcon} alt="telegram" />
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
