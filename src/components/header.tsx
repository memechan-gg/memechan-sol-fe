import { searchAtom } from "@/atoms";
import { usePopup } from "@/context/PopupContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/memechan-ui/Atoms/Button";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Logo } from "./logo";
import { ProfileManagment } from "./profile-management";
import { Search } from "./search";

export const Header = () => {
  const account = useUser();
  const { openPopup } = usePopup();
  const { disconnect } = useWallet();
  const [search, setSearch] = useRecoilState(searchAtom);
  const [isSearchActive, setIsSearchActive] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full max-w-[1240px] m-auto right-0 bg-dark z-10 bg-mono-100">
      <div className=" bottom-border px-3 xl:px-0">
        <div className="flex items-center sm:justify-between h-16 xl:mx-0">
          {!isSearchActive ? (
            <>
              <div className="flex items-center w-full sm:w-fit">
                <Link href="/" className="font-bold text-lg w-10 h-full mr-2 pink-border rounded-sm">
                  <Logo />
                </Link>
                <Link href="/create" className="flex-1">
                  <div className="w-full sm:w-[140px] h-[40px] justify-center text-center">
                    <Button variant="primary" className="hidden sm:block">
                      Create Memecoin
                    </Button>
                    <Button variant="primary" className="block sm:hidden">
                      Create
                    </Button>
                  </div>
                </Link>
              </div>
              <div className="text-white font-bold  text-sm hidden px-2 items-center sm:flex flex-grow justify-center">
                <Typography variant="h4" color="mono-600" className=" sm:hover:text-primary-100">
                  <Link href="/">
                    <span className="mr-3">📦</span>
                    Home
                  </Link>
                </Typography>
                {account?.address ? (
                  <Typography variant="h4" color="mono-600" className="ml-6 sm:hover:text-primary-100">
                    <Link href={`/profile/${account.address}`}>
                      <span className="mr-3">🤡</span>
                      Profile
                    </Link>
                  </Typography>
                ) : (
                  <div
                    onClick={() => {
                      openPopup();
                    }}
                    className="text-center"
                  >
                    <Typography variant="h4" color="mono-600" className="ml-6 sm:hover:text-primary-100">
                      <span className="mr-3">🤡</span>
                      Profile
                    </Typography>
                  </div>
                )}
                <Typography variant="h4" color="mono-600" className="ml-6 sm:hover:text-primary-100">
                  <Link href="https://docs.memechan.gg/" target="_blank" rel="noopener noreferrer">
                    <span className="mr-3">🤓</span>
                    Docs
                  </Link>
                </Typography>
              </div>
              <div className="flex items-center gap-2 ml-2 sm:ml-0">
                <Search
                  isSearchActive={isSearchActive}
                  setIsSearchActive={setIsSearchActive}
                  search={search}
                  setSearch={setSearch}
                />
                <ProfileManagment account={account} disconnect={disconnect} />
              </div>
            </>
          ) : (
            <div className="flex items-center w-full">
              <Link href="/" className="w-10 h-full pink-border rounded-sm">
                <Logo />
              </Link>
              <div className="flex-grow ml-3">
                <Search
                  isSearchActive={isSearchActive}
                  setIsSearchActive={setIsSearchActive}
                  search={search}
                  setSearch={setSearch}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
