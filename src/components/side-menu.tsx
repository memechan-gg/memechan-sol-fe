import { UserContextType } from "@/context/UserContext";
import { RpcConnectionDialog } from "@/views/rpc-connection/rpc-connection-dialog";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TelegramIcon from "../memechan-ui/icons/telegram-icon.svg";
import TwitterIcon from "../memechan-ui/icons/twitter-icon.svg";

export default function SideMenu(props: { account: UserContextType; disconnect: () => Promise<void> }) {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sm:relative focus-visible:outline-none">
      <Popover>
        {({ open }) => {
          setIsOpen(open);
          return (
            <>
              <Popover.Button className="h-10 focus-visible:outline-none">
                <div
                  role="button"
                  className="h-10 text-primary-100 w-10 text-xs font-bold flex justify-evenly items-center bg-inherit hover:bg-primary-100 hover:text-white transition-colors focus-visible:outline-none"
                >
                  {isOpen ? (
                    <FontAwesomeIcon fontSize={16} icon={faClose} />
                  ) : (
                    <FontAwesomeIcon fontSize={16} icon={faEllipsisV} />
                  )}
                </div>
              </Popover.Button>
              <Popover.Panel className="w-[314px] sm:w-[177px] py-[66px] pr-[104px] pl-8 sm:p-6 sm:pr-2 flex flex-col gap-14 sm:gap-8 sm:rounded-sm border border-mono-400 bg-mono-100 shadow-light top-16 sm:top-12 h-max absolute z-10 right-0">
                <Link href={`/`}>
                  <div
                    role="button"
                    className=" sm:mt-2 text-left bg-dark-background font-bold text-white w-full text-xs rounded flex items-center space-x-[12px] hover:opacity-80"
                  >
                    <span>📦</span>
                    <span>Home</span>
                  </div>
                </Link>
                {connected && (
                  <Link href={`/profile/${props.account.address}`}>
                    <div
                      role="button"
                      className=" sm:mt-2 bg-dark-background font-bold text-white w-full text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
                    >
                      <span>🤡</span>
                      <span>Profile</span>
                    </div>
                  </Link>
                )}
                <RpcConnectionDialog />
                <Link href={`/vesting`}>
                  <div
                    role="button"
                    className=" sm:mt-2 bg-dark-background font-bold text-white w-full text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
                  >
                    <span>🪤</span>
                    <span>$CHAN vesting</span>
                  </div>
                </Link>
                <Link
                  href="https://docs.memechan.gg/"
                  className=" sm:mt-2 bg-dark-background font-bold text-white w-full text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>🤓</span>
                  <span>Docs</span>
                </Link>
                {connected && (
                  <button
                    onClick={() => props.disconnect()}
                    className="sm:mt-2 bg-dark-background font-bold text-white w-full text-xs text-left rounded flex items-center space-x-[12px] hover:opacity-80"
                  >
                    <span>🖕</span>
                    <span>Disconnect</span>
                  </button>
                )}
                <div className="bottom-border w-[145px]" />
                <div className="flex gap-12 sm:gap-4">
                  <Image
                    width={24}
                    height={24}
                    src={TwitterIcon}
                    alt="twitter"
                    className="m-[6px] sm:p-1 sm:mx-[2px] sm:my-0 hover:opacity-80 hover:cursor-pointer"
                  />
                  <Image
                    width={24}
                    height={24}
                    src={TelegramIcon}
                    alt="telegram"
                    className="m-[6px] sm:p-1 sm:mx-[2px] sm:my-0 hover:opacity-80 hover:cursor-pointer"
                  />
                </div>
              </Popover.Panel>
            </>
          );
        }}
      </Popover>
    </div>
  );
}
