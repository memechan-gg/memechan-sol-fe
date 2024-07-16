import { useUser } from "@/context/UserContext";
import { CaretDown } from "@phosphor-icons/react/CaretDown";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectWallet } from "./connect-wallet";
import DarkModeToggle from "./dark-mode-toggle";
import { Logo } from "./logo";
import { Search } from "./search";
import SideMenu from "./side-menu";
import { Button } from "./ui-library/Button";

export const Header = () => {
  const account = useUser();
  const { disconnect, connected } = useWallet();
  const [isSearchActive, setIsSearchActive] = useState(false);
  return (
    <header className="relative  top-0 w-full lg:bg-transparent bg-board dark:bg-dark z-10">
      <div className="container mx-0 sm:mx-auto px-2 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          <div className="flex items-center w-full">
            <Link href="/" className="font-bold text-lg w-10 h-10">
              <Logo />
            </Link>
          </div>
          <div>
            <Link href="/create">
              <Button width={165} className=" primary-btn h-10 rounded-sm">
                Create Memecoin
              </Button>
            </Link>
          </div>
          <div>
            <Search />
          </div>
          <div className="flex flex-col xxs:flex-row items-center gap-2">
            <Link
              href="https://docs.memechan.gg/"
              className=" hidden bg-title bg-opacity-15 items-center text-xs justify-center sm:flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </Link>
            <Button className="hidden sm:flex">
              <img src="/tokens/solana.png" className="w-4 h-4" alt="Solana" />
              Solana
              <CaretDown className="w-4 h-4" />
            </Button>
            <DarkModeToggle />
            {account.address ? <SideMenu account={account} disconnect={disconnect} /> : <ConnectWallet />}
          </div>
        </div>
      </div>
    </header>
  );
};
