import { cn } from "@/utils";
import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";

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
          className={cn(
            "bg-title gap-1 bg-opacity-15 items-center text-xs justify-center flex flex-row font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25",
          )}
        >
          Connect
          <span className="lg:flex hidden">Wallet</span>
        </div>
      </Popover.Button>
      <Popover.Panel className="absolute z-10 flex flex-col">
        <div className="bg-white dark:bg-gray-800 gap-1 text-xs flex flex-col font-bold text-regular px-2 py-2">
          {wallets.map((w) => (
            <button
              key={w.adapter.name}
              onClick={() => connectWallet(w.adapter.name)}
              className="w-30 bg-title gap-1 bg-opacity-15 items-center text-xs justify-center flex flex-row font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25"
            >
              <img alt={w.adapter.name} width={20} src={w.adapter.icon} />
              {w.adapter.name}
            </button>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  );
};
