import { useUser } from "@/context/UserContext";
import { Button } from "@/memechan-ui/Atoms/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectWallet } from "./connect-wallet";
import { Logo } from "./logo";
import { Search } from "./search";
import SideMenu from "./side-menu";

export const Header = () => {
  const account = useUser();
  const { disconnect } = useWallet();
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-dark z-10 bg-mono-200">
      <div className="sm:mx-auto px-2 sm:px-6 lg:mx-[150px] bottom-border lg:px-0">
        <div className="flex items-center justify-between h-16 gap-1">
          {!isSearchActive ? (
            <>
              <div className="flex items-center">
                <Link href="/" className="font-bold text-lg w-10 h-10">
                  <Logo />
                </Link>
                <Link href="/create">
                  <Button variant="primary">Create Memecoin</Button>
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
              <div className="flex items-center gap-2 ml-2">
                <Search isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
                {account.address ? <SideMenu account={account} disconnect={disconnect} /> : <ConnectWallet />}
              </div>
            </>
          ) : (
            <div className="flex items-center w-full">
              <Link href="/" className="font-bold text-lg w-10 h-10">
                <Logo />
              </Link>
              <div className="flex-grow ml-3">
                <Search isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
