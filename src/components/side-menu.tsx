import { cn } from "@/utils";
import { RpcConnectionDialog } from "@/views/rpc-connection/rpc-connection-dialog";
import { Popover } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CloseIcon from "../ui-library/icons/close-icon.svg"; // Assuming you have a close icon
import MenuIcon from "../ui-library/icons/menu-icon.svg";
import TelegramIcon from "../ui-library/icons/telegram-icon.svg";
import TwitterIcon from "../ui-library/icons/twitter-icon.svg";
export default function SideMenu(props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Popover>
        <Popover.Button onClick={() => setIsOpen(!isOpen)}>
          <div className="w-[137px] h-10 pink-border dark items-center border-2 rounded transition-all duration-300 overflow-hidden flex">
            <div
              role="button"
              className={cn(
                "items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25",
              )}
            >
              {props.account.address.slice(0, 3)}...
              {props.account.address.slice(-3)}
              <div className="pl-3 w-10 ml-2 p-1 rounded-none border-l border-primaryPink">
                <Image src={isOpen ? CloseIcon : MenuIcon} alt="menu icon" />
              </div>
            </div>
          </div>
        </Popover.Button>
        <Popover.Panel className="w-72 pl-8 primary-border right-0 bg-dark p-3 top-20 h-max absolute z-10 flex flex-col sm:w-[177px] left-[-155px] sm:left-auto">
          <Link href={`/`}>
            <div
              role="button"
              className="mt-14 sm:mt-2 text-left bg-dark-background font-bold text-white w-full text-regular text-xs p-2 hover:text-white rounded"
            >
              Home
            </div>
          </Link>
          <Link href={`/profile/${props.account.address}`}>
            <div
              role="button"
              className="mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded"
            >
              Profile
            </div>
          </Link>
          <Link href={`/vesting`}>
            <div
              role="button"
              className="mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded"
            >
              $CHAN vesting
            </div>
          </Link>
          <RpcConnectionDialog />
          <Link
            href="https://docs.memechan.gg/"
            className="mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </Link>
          <button
            onClick={() => props.disconnect()}
            className=" pb-16 bottom-border mt-14 sm:mt-2 bg-dark-background font-bold text-white w-full text-regular text-xs text-left p-2 hover:text-white rounded"
          >
            Disconnect
          </button>
          <div className=" my-10 flex justify-start">
            <Image src={TwitterIcon} alt="twitter" className=" mr-12" />
            <Image src={TelegramIcon} alt="telegram" />
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
