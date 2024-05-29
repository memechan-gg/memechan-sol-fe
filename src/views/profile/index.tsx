import { ThreadBoard } from "@/components/thread";
import axios from "axios";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(
          `https://waqxcrbt93.execute-api.us-east-1.amazonaws.com/prod/sol/holders?walletAddress=${address}&sortBy=tokenAmount&direction=asc`,
        );
        console.log("Full response:", response);
        const data = response.data;
        console.log("Data:", data);

        if (data && data.result) {
          const tokenPromises = data.result.map(async (token: any) => {
            try {
              const presaleResponse = await axios.get(
                `https://waqxcrbt93.execute-api.us-east-1.amazonaws.com/prod/sol/presale/token?tokenAddress=${token.tokenAddress}`,
              );
              console.log("Presale response:", presaleResponse);
              const presaleData = presaleResponse.data;
              console.log("Presale data for token:", token.tokenAddress, presaleData);

              return {
                mint: token.tokenAddress,
                tokenAmount: token.tokenAmount,
                decimals: 0,
                image: presaleData.image || "",
                name: presaleData.name || "",
                marketCap: presaleData.marketCap || 0,
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
          if (formattedTokens.length === 0) {
            setError("No coins fetched.");
          } else {
            setTokens(formattedTokens);
            setError(null);
          }
        } else {
          setError("No coins fetched.");
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        setError("Error fetching tokens.");
        console.error("Error fetching tokens:", error);
      }
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
              {error ? (
                <div className="text-red-500">{error}</div>
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
