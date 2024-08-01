import { UserContextType } from "@/context/UserContext";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { formatNumber } from "@/utils/formatNumber";
import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import Image from "next/image";
import { useState } from "react";
import SolanaIcon from "../memechan-ui/icons/solana-icon.svg";

export const ConnectWallet = (props: { account: UserContextType; disconnect: () => Promise<void> }) => {
  const { select, wallets, connected, wallet } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const { data: solanaBalance } = useSolanaBalance();

  const connectWallet = async (walletName: string) => {
    const wallet = wallets.find((w) => w.adapter.name === walletName);
    if (wallet) {
      try {
        select(wallet.adapter.name);
        track("ConnectWallet", { wallet: wallet.adapter.name });
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    }
  };

  return (
    <Popover className="sm:relative focus-visible:outline-none h-full flex">
      {({ open }) => {
        setIsOpen(open);
        return (
          <>
            <Popover.Button className="w-full focus-visible:outline-none h-full leading-none flex">
              <div
                role="button"
                className={`h-full w-full gap-y-[6px] text-primary-100 pl-2 text-[0.75rem] font-bold flex flex-col ${connected ? "items-start" : "items-center"} justify-center hover:bg-primary-100 hover:text-white transition-colors focus-visible:outline-none`}
              >
                {connected ? (
                  <>
                    <p>
                      {props.account.address.slice(0, 4)}...{props.account.address.slice(-4)}
                    </p>
                    {solanaBalance && <p className="font-normal">{formatNumber(solanaBalance, 5)} SOL</p>}
                  </>
                ) : isOpen ? (
                  "Cancel"
                ) : (
                  "Connect"
                )}
              </div>
            </Popover.Button>
            <Popover.Panel className=" h-screen bg-mono-100 sm:rounded-sm border border-mono-400 sm:shadow-light p-3 sm:h-max absolute top-[64px] sm:top-12 z-10 flex flex-col w-full sm:w-[430px] left-0 sm:left-auto sm:right-0">
              <div className="flex justify-between mb-1">
                <h1 className="text-white font-bold my-5 text-2xl leading-9">Connect Wallet</h1>
                <Image src={SolanaIcon} alt="solana"></Image>
              </div>
              <div>
                {wallets.map((w) => (
                  <button
                    key={w.adapter.name}
                    onClick={() => connectWallet(w.adapter.name)}
                    className="p-4 h-16 w-full mt-2 sm:rounded-sm border border-mono-400 shadow-light bg-mono-200 flex items-center justify-between font-bold hover:opacity-80"
                  >
                    <div className="flex items-center">
                      <img alt={w.adapter.name} width={24} className="mr-4" src={w.adapter.icon} />
                      {w.adapter.name}
                    </div>
                    {w.readyState === "Installed" && (
                      <Typography variant="body" color="mono-500">
                        Detected
                      </Typography>
                    )}
                  </button>
                ))}
              </div>
            </Popover.Panel>
          </>
        );
      }}
    </Popover>
  );
};
