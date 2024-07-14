import { ThreadBoard } from "@/components/thread";
import { BE_URL_DEV } from "@avernikoz/memechan-sol-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CoinItem } from "./coin-item";

type ProfileProps = {
  address: string;
  coin: string;
};

type Token = {
  mint: string;
  tokenAmount: number;
  decimals: number;
  image: string;
  name: string;
  marketCap: number;
};

export function Profile({ address, coin }: ProfileProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // TODO: Use SDK methods instead of direct fetch
        const response = await fetch(
          `${BE_URL_DEV}/sol/holders?walletAddress=${address}&sortBy=tokenAmountInPercentage&direction=asc`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching tokens: ${response.statusText}`);
        }
        const data = await response.json();

        if (data && data.result) {
          const tokenPromises = data.result.map(async (token: any) => {
            try {
              // TODO: Use SDK methods instead of direct fetch
              let presaleResponse = await fetch(`${BE_URL_DEV}/sol/presale/token?tokenAddress=${token.tokenAddress}`);
              let presaleData = await presaleResponse.json();

              // Check if presaleData is an empty object
              if (Object.keys(presaleData).length === 0) {
                // TODO: Use SDK methods instead of direct fetch
                presaleResponse = await fetch(`${BE_URL_DEV}/sol/live/token?tokenAddress=${token.tokenAddress}`);
                presaleData = await presaleResponse.json();
              }

              return {
                mint: token.tokenAddress,
                tokenAmount: token.tokenAmount,
                decimals: 0,
                image: presaleData.image || "",
                name: presaleData.name || "",
                marketCap: presaleData.marketcap || 0,
              };
            } catch (presaleError) {
              console.error("Error fetching presale data for token:", token.tokenAddress, presaleError);
              return {
                mint: token.tokenAddress,
                tokenAmount: token.tokenAmount,
                decimals: 0,
                image: "",
                name: "",
                marketCap: 0,
              };
            }
          });

          const formattedTokens = await Promise.all(tokenPromises);
          setTokens(formattedTokens);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        setError("Error fetching tokens.");
        console.error("Error fetching tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [address]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <ThreadBoard title="Profile" showNavigateBtn navigateUrl={`/coin/${coin}`}>
          <div className="flex flex-col gap-3">
            {/* Address */}
            <div className="flex flex-col gap-1 text-regular">
              <h4 className="text-base font-bold">Address</h4>
              <div className="text-xs cursor-pointer hover:underline">
                <a target="_blank" rel="noreferrer" href={`https://solana.fm/address/${address}`}>
                  {address}
                </a>
              </div>
            </div>
            {/* Coins Held */}
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-base font-bold text-regular">Coins Held</h4>
              {isLoading ? (
                <div className="text-regular">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : tokens.length === 0 ? (
                <div className="text-red-500">No coins fetched.</div>
              ) : (
                <div className="flex flex-col gap-2 max-w-xs text-regular font-medium">
                  {tokens.map((token, index) => (
                    <div key={index}>
                      <Link href={`/coin/${token.mint}`}>
                        {token.mint}
                        <CoinItem image={token.image} name={token.name} marketCap={token.marketCap} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ThreadBoard>
      </div>
    </div>
  );
}
