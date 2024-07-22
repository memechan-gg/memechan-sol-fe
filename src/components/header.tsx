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
    <header className="fixed top-0 left-0 w-full bg-dark z-10 bg-mono-100">
      <div className="mx-2 sm:px-6 lg:px-8 bottom-border lg:mx-[150px]">
        <div className="flex items-center justify-between h-16">
          {!isSearchActive ? (
            <>
              <div className="flex items-center">
                <Link href="/" className="font-bold text-lg w-10 h-full mr-2 pink-border rounded-sm">
                  <Logo />
                </Link>
                <Link href="/create">
                  <div className="sm:w-[140px] h-full justify-center text-center">
                    <Button variant="primary">Create Memecoin</Button>
                  </div>
                </Link>
              </div>
              <div className="text-white font-bold text-sm hidden px-2 items-center sm:flex flex-grow justify-center gap-4">
                <Link href="/" className="font-bold text-center">
                  📦 Home
                </Link>
                <Link href={`/profile/${account.address}`} className="text-center">
                  🤡 Profile
                </Link>
                <Link
                  href="https://docs.memechan.gg/"
                  className="text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
              <Link href="/" className="font-bold text-lg w-10 h-full pink-border rounded-sm">
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
