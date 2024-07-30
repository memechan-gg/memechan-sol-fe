import { useUser } from "@/context/UserContext";
import type { ButtonProps } from "@/memechan-ui/Atoms";
import { Button } from "@/memechan-ui/Atoms";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Popover } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { track } from "@vercel/analytics";

export const WithConnectedWallet = (props: ButtonProps) => {
  const account = useUser();
  const { select, wallets } = useWallet();

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

  if (!account.address) {
    return (
      <Popover className="sm:relative">
        <Popover.Button className="w-full">
          <div className="h-14">
            <Button {...props} role="button">
              <Typography variant="h4">Connect Wallet</Typography>
            </Button>
          </div>
        </Popover.Button>
        <Popover.Panel className="bg-mono-100 sm:rounded-sm border border-mono-400 sm:shadow-light p-3 h-max absolute top-[-64px] sm:top-12 z-10 flex flex-col w-full sm:w-[430px] left-0 sm:left-auto sm:right-0">
          <div className="flex justify-between mb-1">
            <h1 className="text-white font-bold my-5 text-2xl leading-9">Connect Wallet</h1>
            {/* <Image src={SolanaIcon} alt="solana"></Image> */}
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
  }

  return <Button {...props} />;
};
