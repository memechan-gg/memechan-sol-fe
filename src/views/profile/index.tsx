import { ThreadBoard } from "@/components/thread";
import { useEffect, useState } from "react";
import { useCoinApi } from "../home/hooks/useCoinApi";
import { CoinItem } from "./coin-item";

type ProfileProps = {
  address: string;
};

type Token = {
  mint: string;
  tokenAmount: number;
  decimals: number;
  image: string;
  name: string;
  marketCap: number;
};

export function Profile({ address }: ProfileProps) {
  const { items: tokenList, status, setStatus, sortBy, setSortBy, direction, setDirection } = useCoinApi();
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const response = await fetch(
        `https://waqxcrbt93.execute-api.us-east-1.amazonaws.com/prod/sol/holders?walletAddress=${address}&sortBy=tokenAmount&direction=asc`,
      );
      const data = await response.json();

      const formattedTokens = data.result.map((token: any) => ({
        mint: token.tokenAddress,
        tokenAmount: token.tokenAmount,
        decimals: 0,
        image: "",
        name: "",
        marketCap: 0,
      }));

      setTokens(formattedTokens);
    };

    fetchTokens();
  }, [address]);

  console.log(tokenList);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <ThreadBoard title="Profile">
          <div className="flex flex-col gap-3">
            {/* Address */}
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-regular">Address</h4>
              <div className="text-xs">{address}</div>
              <a target="_blank" rel="noreferrer" href={`https://solscan.io/account/${address}`}>
                <h4 className="text-sm font-bold text-regular">Show on solscan</h4>
              </a>
            </div>
            {/* Coins Held */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-bold text-regular">Coins Held</h4>
              <div className="flex flex-col gap-2 max-w-xs text-regular font-medium">
                {tokens.map((token, index) => (
                  <div key={index}>
                    {token.mint}
                    <CoinItem image={token.image} name={token.name} marketCap={token.marketCap.toString()} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ThreadBoard>
      </div>
    </div>
  );
}
