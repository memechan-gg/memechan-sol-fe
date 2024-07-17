import { useUser } from "@/context/UserContext";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui-library/Button";
import { ConnectWallet } from "./connect-wallet";
import { Logo } from "./logo";
import { Search } from "./search";
import SideMenu from "./side-menu";

export const Header = () => {
  const account = useUser();
  const { disconnect, connected } = useWallet();
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className=" bg-dark bottom-border relative top-0 w-full lg:bg-transparent z-10">
      <div className=" mx-0 sm:mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1">
          {!isSearchActive ? (
            <>
              <div className="flex items-center">
                <Link href="/" className="font-bold text-lg w-10 h-10">
                  <Logo />
                </Link>
                <Link href="/create">
                  <Button className="ml-2 w-[165px] text-white primary-btn h-10 rounded-sm">Create Memecoin</Button>
                </Link>
              </div>
              <div className="hidden items-center sm:flex flex-grow justify-center gap-4">
                <Link
                  href="https://docs.memechan.gg/"
                  className="text-xs font-bold text-regular"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </Link>
                <Link href="/" className="text-xs font-bold text-regular">
                  Home
                </Link>
                <Link href={`/profile/${account.address}`} className="text-xs font-bold text-regular">
                  Profile
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Search isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
                {account.address ? <SideMenu account={account} disconnect={disconnect} /> : <ConnectWallet />}
              </div>
            </>
          ) : (
            <div className="flex items-center w-full">
              <Link href="/" className="font-bold text-lg w-10 h-10">
                <Logo />
              </Link>
              <div className="flex-grow">
                <Search isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
