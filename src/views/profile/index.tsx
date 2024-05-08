import { ThreadBoard } from "@/components/thread";
import { CoinItem } from "./coin-item";

type ProfileProps = {
  address: string;
};

export function Profile({ address }: ProfileProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <ThreadBoard title="Profile">
          <div className="flex flex-col gap-3">
            {/* Address */}
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-regular">Address</h4>
              <div className="text-xs">{address}</div>
              <a target="_blank" rel="noreferrer" href={`https://suiscan.xyz/mainnet/account/${address}`}>
                <h4 className="text-sm font-bold text-regular">Show on suiscan</h4>
              </a>
            </div>
            {/* Coins Held */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-regular">Coins Held</h4>
              <div className="flex flex-col gap-2 max-w-xs text-regular font-medium">
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
                <CoinItem
                  image="https://pump.mypinata.cloud/ipfs/Qmf2nmSUCaGfVWiUHpzXiuCgEL4KbjqH7BdSz9hnLdhiNg"
                  name="Meme Coin 1"
                  marketCap="17.83K"
                />
              </div>
            </div>
          </div>
        </ThreadBoard>
      </div>
    </div>
  );
}
