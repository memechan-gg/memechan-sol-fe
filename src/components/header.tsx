import { useUser } from "@/context/UserContext";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../memechan-ui/Atoms/Button";
import { ConnectWallet } from "./connect-wallet";
import { Logo } from "./logo";
import { Search } from "./search";
import SideMenu from "./side-menu";

export const Header = () => {
  const account = useUser();
  const { disconnect } = useWallet();
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-dark bottom-border z-10 bg-monochrome-200">
      <div className="mx-0 sm:mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1">
          {!isSearchActive ? (
            <>
              <div className="flex items-center">
                <Link href="/" className="font-bold text-lg w-10 h-10">
                  <Logo />
                </Link>
                <Link href="/create">
                  <Button className="ml-2 w-[165px] text-white primary-btn h-10 rounded-sm hover:bg-primary-200">
                    Create Memecoin
                  </Button>
                </Link>
              </div>
              <div className="text-white font-bold text-sm hidden items-center sm:flex flex-grow justify-center gap-4">
                <Link href="/" className="font-bold">
                  📦 Home
                </Link>
                <Link href={`/profile/${account.address}`}>🤡 Profile</Link>
                <Link href="https://docs.memechan.gg/" target="_blank" rel="noopener noreferrer">
                  🤓 Docs
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
