import { ThreadBoard } from "@/components/thread";
import { useEffect, useState } from "react";
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
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          `https://waqxcrbt93.execute-api.us-east-1.amazonaws.com/prod/sol/holders?walletAddress=${`BdT3bBgwk6vsizdM4ozjGY4jiTHmg5kArUHVpQCeAeH`}&sortBy=tokenAmount&direction=asc`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching tokens: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Data:", data);

        if (data && data.result) {
          const tokenPromises = data.result.map(async (token: any) => {
            try {
              let presaleResponse = await fetch(
                `https://waqxcrbt93.execute-api.us-east-1.amazonaws.com/prod/sol/presale/token?tokenAddress=${token.tokenAddress}`,
              );
              let presaleData = await presaleResponse.json();
              console.log("Presale data for token:", token.tokenAddress, presaleData);

              // Check if presaleData is an empty object
              if (Object.keys(presaleData).length === 0) {
                presaleResponse = await fetch(
                  `https://waqxcrbt93.execute-api.us-east-1.amazonaws.com/prod/sol/live/token?tokenAddress=${token.tokenAddress}`,
                );
                presaleData = await presaleResponse.json();
                console.log("Live data for token:", token.tokenAddress, presaleData);
              }

              return {
                mint: token.tokenAddress,
                tokenAmount: token.tokenAmount,
                decimals: 0, // Assuming you don't have decimals info from the API
                image: presaleData.image || "", // Assuming the presale API returns an image
                name: presaleData.name || "", // Assuming the presale API returns a name
                marketCap: presaleData.marketCap || 0, // Assuming the presale API returns a market cap
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
      }
    };

    fetchTokens();
  }, [address]);

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
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : tokens.length === 0 ? (
                <div className="text-red-500">No coins fetched.</div>
              ) : (
                <div className="flex flex-col gap-2 max-w-xs text-regular font-medium">
                  {tokens.map((token, index) => (
                    <div key={index}>
                      {token.mint}
                      <CoinItem image={token.image} name={token.name} marketCap={token.marketCap.toString()} />
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
