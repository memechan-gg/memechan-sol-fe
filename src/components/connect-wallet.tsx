import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";
import Image from "next/image";
import MenuIcon from "../ui-library/icons/menu-icon.svg";
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
          className="text-primaryPink text-xs font-bold h-10 w-[137px] justify-evenly rounded-sm bg-inherit border pink-border flex items-center"
        >
          Connect
          <div className=" w-10 pl-4 ml-2 p-1 rounded-none border-l border-primaryPink">
            <Image src={MenuIcon} alt="menu icon" />
          </div>
        </div>
      </Popover.Button>
      <Popover.Panel className="bg-dark p-3 top-20 h-max absolute z-10 flex flex-col w-full sm:w-[430px] left-0 sm:left-auto sm:transform sm:translate-x-[-50%] right-[-202px]">
        <div className="flex justify-between">
          <h1 className="text-white font-bold text-2xl leading-9">Connect Wallet</h1>
          <Image src={SolanaIcon} alt="solana"></Image>
        </div>
        <div className="">
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
