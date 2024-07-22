import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import Image from "next/image";
import SolanaIcon from "../memechan-ui/icons/solana-icon.svg";
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
          className="text-primary-100 text-xs font-bold h-10 w-[130px] sm:w-[137px] justify-evenly rounded-sm bg-inherit border border-primary-100 flex items-center"
        >
          <span className="text-primary-100 text-xs leading-5 font-bold flex-1 h-full flex items-center justify-center hover:bg-primary-100 hover:text-white transition-colors">
            Connect
          </span>
          <span className="h-[90%] border-r border-primary-100"></span>
          <div className="flex items-center justify-center w-10 h-full hover:bg-primary-100 hover:text-white transition-colors">
            <div className="flex flex-col items-center justify-center space-y-1 text-current">
              <div className="w-0.5 h-0.5 rounded-full bg-current"></div>
              <div className="w-0.5 h-0.5 rounded-full bg-current"></div>
              <div className="w-0.5 h-0.5 rounded-full bg-current"></div>
            </div>
          </div>
        </div>
      </Popover.Button>
      <Popover.Panel className="bg-mono-100 sm:rounded-sm border border-mono-400  sm:shadow-light p-3 h-max absolute top-[64px] sm:top-[60px] z-10 flex flex-col w-full sm:w-[430px] left-0 sm:left-auto sm:transform sm:translate-x-[-50%] sm:right-[-191px] lg:right-[-183px]">
        <div className="flex justify-between mb-1">
          <h1 className="text-white font-bold my-5 text-2xl leading-9">Connect Wallet</h1>
          <Image src={SolanaIcon} alt="solana"></Image>
        </div>
        <div>
          {wallets.map((w) => (
            <button
              key={w.adapter.name}
              onClick={() => connectWallet(w.adapter.name)}
              className=" p-4 h-16 w-full mt-2 sm:rounded-sm border border-mono-400 shadow-light bg-mono-200 flex items-center font-bold hover:opacity-80"
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
