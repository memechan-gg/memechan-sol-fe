import { UserContextType } from "@/context/UserContext";
import ThemeSwitcher from "@/memechan-ui/Atoms/ThemeSwitcher/ThemeSwitcher";
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <div className="sm:relative focus-visible:outline-none">
      <Popover>
        {({ open, close }) => {
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
              <Popover.Panel className="w-[99.6%] sm:justify-between mr-px h-screen sm:h-fit sm:w-[177px] pb-[66px] pt-[45px]  pl-8 pr-[104px] sm:p-6 sm:pb-4 sm:pt-2 sm:pr-2 flex flex-col gap-4 sm:gap-x-8 sm:gap-y-1 sm:rounded-sm border border-mono-400 bg-mono-100 shadow-light top-16 sm:top-12 absolute z-10 right-0">
                <Link
                  href={`/`}
                  onClick={() => {
                    close();
                  }}
                >
                  <div
                    role="button"
                    className=" min-h-14 hover:cursor-pointer sm:mt-2 text-left font-bold text-white w-full text-xs rounded flex items-center space-x-[12px] h-full  sm:min-h-12 sm:hover:opacity-80"
                  >
                    <span>📦</span>
                    <span>Home</span>
                  </div>
                </Link>
                {connected && (
                  <Link
                    href={`/profile/${props.account.address}`}
                    onClick={() => {
                      close();
                    }}
                  >
                    <div
                      role="button"
                      className="min-h-14 hover:cursor-pointer sm:mt-2 font-bold text-white w-full text-xs text-left rounded flex h-full items-center space-x-[12px] sm:min-h-12 sm:hover:opacity-80"
                    >
                      <span>🤡</span>
                      <span>Profile</span>
                    </div>
                  </Link>
                )}
                <div className="">
                  <RpcConnectionDialog
                    onClick={() => {
                      close();
                    }}
                  />
                </div>
                <Link
                  href={`/vesting`}
                  onClick={() => {
                    close();
                  }}
                >
                  <div
                    role="button"
                    className="min-h-14 hover:cursor-pointer sm:mt-2 font-bold text-white w-full text-xs text-left rounded flex  items-center space-x-[12px]  sm:min-h-12 sm:hover:opacity-80"
                  >
                    <span>🪤</span>
                    <span>$CHAN vesting</span>
                  </div>
                </Link>
                <Link
                  href="https://docs.memechan.gg/"
                  className="min-h-14 hover:cursor-pointer sm:mt-2 font-bold text-white w-full text-xs text-left rounded flex items-center space-x-[12px] sm:min-h-12 sm:hover:opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    close();
                  }}
                >
                  <span>🤓</span>
                  <span>Docs</span>
                </Link>
                {connected && (
                  <button
                    onClick={() => {
                      props.disconnect();
                      close();
                    }}
                    className="min-h-14 hover:cursor-pointer sm:mt-2 font-bold text-white w-full text-xs text-left rounded flex  items-center space-x-[12px] sm:min-h-12 sm:hover:opacity-80"
                  >
                    <span>🖕</span>
                    <span>Disconnect</span>
                  </button>
                )}
                <div className="bottom-border w-full" />
                <div className="flex gap-12 sm:gap-4 align-middle items-center sm:mb-0">
                  <a href="https://x.com/memechan_gg" target="_blank" rel="noopener noreferrer">
                    <Image
                      width={24}
                      height={24}
                      src={TwitterIcon}
                      alt="twitter"
                      className="m-[6px] sm:p-1 sm:mx-[2px] sm:my-0 sm:hover:opacity-80 sm:hover:cursor-pointer min-h-14 sm:min-h-12"
                    />
                  </a>
                  <a href="https://t.me/memechan_gg" target="_blank" rel="noopener noreferrer">
                    <Image
                      width={24}
                      height={24}
                      src={TelegramIcon}
                      alt="telegram"
                      className="m-[6px] sm:p-1 sm:mx-[2px] sm:my-0 sm:hover:opacity-80 sm:hover:cursor-pointer min-h-14  sm:min-h-12"
                    />
                  </a>
                </div>
                <div className="bottom-border w-full" />
                <div className="mt-6 sm:mt-2">
                  <ThemeSwitcher
                    activeTheme={theme}
                    onClick={(string) => {
                      setTheme(string);
                    }}
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
