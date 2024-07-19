import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import Image from "next/image";
import SolanaIcon from "../ui-library/icons/solana-icon.svg";
export const ConnectWallet = () => {
  const { disconnect, select, wallets, connect } = useWallet();

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
    <Popover>
      <Popover.Button>
        <div
          role="button"
          className="text-primary-100 text-xs font-bold h-10 w-[130px] sm:w-[137px] justify-evenly rounded-sm bg-inherit border pink-border flex items-center"
        >
          <span className="text-primary-100 text-xs font-bold flex-1 h-full flex items-center justify-center hover:bg-primary-100 hover:text-white transition-colors">
            Connect
          </span>
          <span className="h-[90%] border-r border-primary-100"></span>
          <div className="flex items-center justify-center w-10 h-full hover:bg-primary-100 hover:text-white transition-colors">
            <div className="flex flex-col items-center justify-center space-y-1 text-current">
              <div className="w-1 h-1 rounded-full bg-current"></div>
              <div className="w-1 h-1 rounded-full bg-current"></div>
              <div className="w-1 h-1 rounded-full bg-current"></div>
            </div>
          </div>
        </div>
      </Popover.Button>
      <Popover.Panel className="bg-dark p-3 top-20 h-max absolute z-10 flex flex-col w-full sm:w-[430px] left-0 sm:left-auto sm:transform sm:translate-x-[-50%] right-[-202px]">
        <div className="flex justify-between">
          <h1 className="text-white font-bold text-2xl leading-9">Connect Wallet</h1>
          <Image src={SolanaIcon} alt="solana"></Image>
        </div>
        <div>
          {wallets.map((w) => (
            <button
              key={w.adapter.name}
              onClick={() => connectWallet(w.adapter.name)}
              className=" p-4 h-16 w-full mt-2 border border-white bg-dark flex items-center font-bold"
            >
              <img alt={w.adapter.name} width={24} className="mr-4" src={w.adapter.icon} />
              {w.adapter.name}
            </button>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};
