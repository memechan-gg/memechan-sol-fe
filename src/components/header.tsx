import { useUser } from "@/context/UserContext";
import { cn } from "@/utils/cn";
import { Popover } from "@headlessui/react";
import { CaretDown } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "./button";
import { Logo } from "./logo";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';


export const Header = () => {
  const account = useUser();
  const { disconnect } = useWallet();

  return (
    <header className="lg:relative fixed top-0 w-full lg:bg-transparent bg-board">
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center w-full">
            <Link href="/" className="font-bold text-lg">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <img src="/tokens/solana.png" className="w-4 h-4" alt="Solana" />
              Solana
              <CaretDown className="w-4 h-4" />
            </Button>
            {account.address ? (
              <Popover>
                <Popover.Button>
                  <div
                    role="button"
                    className={cn(
                      "bg-title bg-opacity-15 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25",
                    )}
                  >
                    {account.address.slice(0, 3)}...
                    {account.address.slice(-3)}
                  </div>
                </Popover.Button>
                <Popover.Panel className="absolute z-10 flex flex-col">
                  <Link href={`/profile/${account.address}`}>
                    <div
                      role="button"
                      className="bg-white w-full text-regular text-xs text-left p-2 hover:bg-regular hover:text-white"
                    >
                      Profile
                    </div>
                  </Link>
                  <button
                    onClick={() => disconnect()}
                    className="bg-white text-regular text-xs text-left p-2 hover:bg-regular hover:text-white"
                  >
                    Disconnect
                  </button>
                </Popover.Panel>
              </Popover>
            ) : (
              <WalletModalProvider>
                  <div
                    role="button"
                    className={cn(
                      "bg-title gap-1 bg-opacity-15 items-center text-xs justify-center flex flex-row font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25",
                    )}
                  >
                    Connect
                    <span className="lg:flex hidden">Wallet</span>
                  </div>
              </WalletModalProvider>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
