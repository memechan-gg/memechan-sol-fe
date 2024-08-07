import { usePopup } from "@/context/PopupContext";
import { UserContextType, useUser } from "@/context/UserContext";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { formatNumber } from "@/utils/formatNumber";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import SolanaIcon from "../memechan-ui/icons/solana-icon.svg";

export const ConnectWallet = (props: { account: UserContextType; disconnect: () => Promise<void> }) => {
  const { select, wallets, connected } = useWallet();
  const { isPopupOpen, openPopup, closePopup } = usePopup();
  const { data: solanaBalance } = useSolanaBalance();
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverButtonRef = useRef<HTMLDivElement>(null);
  const account = useUser();

  const connectWallet = async (walletName: string) => {
    const wallet = wallets.find((w) => w.adapter.name === walletName);
    if (wallet) {
      try {
        select(wallet.adapter.name);
        track("ConnectWallet", { wallet: wallet.adapter.name });
        closePopup(); // Close the popover after successful connection
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;

      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node | null) &&
        !popoverButtonRef.current?.contains(event.target as Node | null) &&
        !target.textContent?.includes("Connect Wallet") &&
        !target.textContent?.includes("Profile")
      ) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen, closePopup]);

  return (
    <div className="sm:relative focus-visible:outline-none h-full flex">
      {connected ? (
        <Link href={`/profile/${account.address}`}>
          <div
            role="button"
            className={`h-full w-full min-w-[97px] text-primary-100 px-3 text-[0.75rem] font-bold flex flex-col ${connected ? "items-start" : "items-center"} justify-center hover:bg-primary-100 hover:text-white transition-colors focus-visible:outline-none`}
            ref={popoverButtonRef}
          >
            <>
              <h4 className="font-bold size-[13-px] leading-5">
                {props.account.address.slice(0, 4)}...{props.account.address.slice(-4)}
              </h4>
              {solanaBalance !== undefined && solanaBalance !== null && (
                <p className="font-normal">{formatNumber(solanaBalance, 5)} SOL</p>
              )}
            </>
          </div>
        </Link>
      ) : (
        <div
          role="button"
          className={`h-full w-full px-3 text-primary-100 text-[0.75rem] font-bold flex flex-col ${connected ? "items-start" : "items-center"} justify-center hover:bg-primary-100 hover:text-white transition-colors focus-visible:outline-none`}
          onClick={() => {
            isPopupOpen ? closePopup() : openPopup();
          }}
          ref={popoverButtonRef}
        >
          {isPopupOpen ? "Cancel" : "Connect"}
        </div>
      )}

      {isPopupOpen && (
        <div
          className="h-screen bg-mono-100 sm:rounded-sm border border-mono-400 sm:shadow-light p-3 sm:h-max absolute top-[64px] sm:top-12 z-10 flex flex-col w-full sm:w-[430px] left-0 sm:left-auto sm:right-0"
          ref={popoverRef}
        >
          <div className="flex justify-between mb-1">
            <h1 className="text-white font-bold my-5 text-2xl leading-9">Connect Wallet</h1>
            <Image src={SolanaIcon} alt="solana" />
          </div>
          <div>
            {wallets.map((w) => (
              <button
                key={w.adapter.name}
                onClick={() => connectWallet(w.adapter.name)}
                className="p-4 h-16 w-full mt-2 sm:rounded-sm border border-mono-400 shadow-light bg-mono-200 flex items-center justify-between font-bold sm:hover:opacity-80"
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
        </div>
      )}
    </div>
  );
};
