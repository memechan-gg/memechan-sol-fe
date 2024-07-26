import { BE_URL } from "@/common/solana";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSlicedAddressV2 } from "../coin/sidebar/holders/utils";
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
  const { data: solanaBalance } = useSolanaBalance();
  const slicedAddress = address ? getSlicedAddressV2(address) : null;

  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // TODO: Use SDK methods instead of direct fetch
        const response = await fetch(
          `${BE_URL}/sol/holders?walletAddress=${address}&sortBy=tokenAmountInPercentage&direction=asc`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching tokens: ${response.statusText}`);
        }
        const data = await response.json();

        if (data && data.result) {
          const tokenPromises = data.result.map(async (token: any) => {
            try {
              // TODO: Use SDK methods instead of direct fetch
              let presaleResponse = await fetch(`${BE_URL}/sol/presale/token?tokenAddress=${token.tokenAddress}`);
              let presaleData = await presaleResponse.json();

              // Check if presaleData is an empty object
              if (Object.keys(presaleData).length === 0) {
                // TODO: Use SDK methods instead of direct fetch
                presaleResponse = await fetch(`${BE_URL}/sol/live/token?tokenAddress=${token.tokenAddress}`);
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
    <>
      <TopBar rightIcon="/heart.png" title={"Profile"}></TopBar>
      <div className=" w-full flex flex-col p-3 xl:px-0 pt-2 items-center ">
        <div className=" h-[194px] p-4 w-full border rounded-sm border-mono-400 custom-outer-shadow ">
          <div className="flex flex-col">
            <div className="flex flex-col text-regular">
              <img
                className="w-[102px] h-[102px] object-cover object-center border border-mono-300"
                //TODO insert real image
                src="/android-chrome-192x192.png"
                alt="Profile Image"
              />
              <div className="text-xs mt-4 cursor-pointer hover:underline">
                <a target="_blank" rel="noreferrer" href={`https://solana.fm/address/${address}`}>
                  <Typography variant="h4">{slicedAddress}</Typography>
                </a>
              </div>
              <Typography variant="body" color="mono-500">
                {slicedAddress} / 👛 {solanaBalance ?? 0} SOL
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <Divider />
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
    </>
  );
}
