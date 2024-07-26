import { TokenCard } from "@/components/TokenCard";
import { useSolanaBalance } from "@/hooks/useSolanaBalance";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { useState } from "react";
import { getSlicedAddressV2 } from "../coin/sidebar/holders/utils";

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
//TODO ALDIN , INSERT REAL TOKENS AFTER FIX FETCHING TOKENS ERROR
const dummyTokens: any[] = [
  {
    name: "SOLDOG",
    address: "AmhW7smMiTiTBUD5pUaFgq3Cq2RZoWEaJRLvZavsKH37",
    decimals: 6,
    symbol: "SOLDOG",
    description: "SOLDOG",
    image:
      "https://lavender-gentle-primate-223.mypinata.cloud/ipfs/QmdZrkEnaT7DVRjkWNnqQZAcgdQKF4QvTThcTZ6c2qZzZj?pinataGatewayToken=M45Jh03NicrVqTZJJhQIwDtl7G6fGS90bjJiIQrmyaQXC_xXj4BgRqjjBNyGV7q2",
    lastReply: 0,
    marketcap: 85.84968719185119,
    creator: "HLaPceN1Hct4qvDC21PetsaVkyUrBC97n1FYeXAZ4mz5",
    status: "PRESALE",
    socialLinks: {
      telegram: "",
      website: "",
      twitter: "",
      discord: "",
    },
    txDigest: "QpKHTHFjoupU7sWJ74NT4Fpox8P8kHzRjbG79oF3a8SxAFyAVZjLu3ScwoiRhPo6eqbrxVu4jXnmXUCx9x3vowJ",
    creationTime: 1718985843865,
    holdersCount: 4,
    quoteIn: "1094500000000",
  },
  {
    name: "mem4",
    address: "8NudgqMi9V3E4jq1uaUg9Ya15aMX7rLwyF5sVkj1V8Zq",
    decimals: 6,
    symbol: "mem4",
    description: "mem4",
    image:
      "https://lavender-gentle-primate-223.mypinata.cloud/ipfs/QmWE2WwRNT1AUdLEUo6CBXLWpM4JyJC7nbEC4WMz7C5LvH?pinataGatewayToken=M45Jh03NicrVqTZJJhQIwDtl7G6fGS90bjJiIQrmyaQXC_xXj4BgRqjjBNyGV7q2",
    lastReply: 0,
    marketcap: 0,
    creator: "2NcmLZYeRdHYkTazDDYEkqBL1d4cMdSzAeDF4z5wc2WB",
    status: "LIVE",
    holders: 6,
    socialLinks: {
      telegram: "",
      website: "",
      twitter: "",
      discord: "",
    },
    txDigest: "5Le6Z7nzoDgnwa6MaPKbhVjsUEuQMiiFgpvxxy1jEyXd9F24DnZiinDMi15zaUqnEatHYeZQ9WZPaMxYsghEPkgf",
    creationTime: 1716761653047,
  },
  {
    name: "mem4",
    address: "8NudgqMi9V3E4jq1uaUg9Ya15aMX7rLwyF5sVkj1V8Zq",
    decimals: 6,
    symbol: "mem4",
    description: "mem4",
    image:
      "https://lavender-gentle-primate-223.mypinata.cloud/ipfs/QmWE2WwRNT1AUdLEUo6CBXLWpM4JyJC7nbEC4WMz7C5LvH?pinataGatewayToken=M45Jh03NicrVqTZJJhQIwDtl7G6fGS90bjJiIQrmyaQXC_xXj4BgRqjjBNyGV7q2",
    lastReply: 0,
    marketcap: 0,
    creator: "2NcmLZYeRdHYkTazDDYEkqBL1d4cMdSzAeDF4z5wc2WB",
    status: "LIVE",
    socialLinks: {
      telegram: "",
      website: "",
      twitter: "",
      discord: "",
    },
    txDigest: "5Le6Z7nzoDgnwa6MaPKbhVjsUEuQMiiFgpvxxy1jEyXd9F24DnZiinDMi15zaUqnEatHYeZQ9WZPaMxYsghEPkgf",
    creationTime: 1716761653047,
  },
];

export function Profile({ address, coin }: ProfileProps) {
  const [tokens, setTokens] = useState<Token[]>(dummyTokens); // Use dummyTokens for now
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: solanaBalance } = useSolanaBalance();
  const slicedAddress = address ? getSlicedAddressV2(address) : null;

  // useEffect(() => {
  //   const fetchTokens = async () => {
  //     setIsLoading(true);
  //     try {
  //       // TODO: Use SDK methods instead of direct fetch
  //       const response = await fetch(
  //         `${BE_URL}/sol/holders?walletAddress=${address}&sortBy=tokenAmountInPercentage&direction=asc`,
  //       );
  //       if (!response.ok) {
  //         throw new Error(`Error fetching tokens: ${response.statusText}`);
  //       }
  //       const data = await response.json();

  //       if (data && data.result) {
  //         const tokenPromises = data.result.map(async (token: any) => {
  //           try {
  //             // TODO: Use SDK methods instead of direct fetch
  //             let presaleResponse = await fetch(`${BE_URL}/sol/presale/token?tokenAddress=${token.tokenAddress}`);
  //             let presaleData = await presaleResponse.json();

  //             // Check if presaleData is an empty object
  //             if (Object.keys(presaleData).length === 0) {
  //               // TODO: Use SDK methods instead of direct fetch
  //               presaleResponse = await fetch(`${BE_URL}/sol/live/token?tokenAddress=${token.tokenAddress}`);
  //               presaleData = await presaleResponse.json();
  //             }

  //             return {
  //               mint: token.tokenAddress,
  //               tokenAmount: token.tokenAmount,
  //               decimals: 0,
  //               image: presaleData.image || "",
  //               name: presaleData.name || "",
  //               marketCap: presaleData.marketcap || 0,
  //             };
  //           } catch (presaleError) {
  //             console.error("Error fetching presale data for token:", token.tokenAddress, presaleError);
  //             return {
  //               mint: token.tokenAddress,
  //               tokenAmount: token.tokenAmount,
  //               decimals: 0,
  //               image: "",
  //               name: "",
  //               marketCap: 0,
  //             };
  //           }
  //         });

  //         const formattedTokens = await Promise.all(tokenPromises);
  //         setTokens(formattedTokens);
  //       } else {
  //         console.error("Unexpected data format:", data);
  //       }
  //     } catch (error) {
  //       setError("Error fetching tokens.");
  //       console.error("Error fetching tokens:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchTokens();
  // }, [address]);

  return (
    <>
      <TopBar rightIcon="/heart.png" title={"Profile"} />
      <div className="w-full flex flex-col p-3 xl:px-0 pt-2 items-center">
        <div className="h-[194px] p-4 w-full border rounded-sm border-mono-400 custom-outer-shadow">
          <div className="flex flex-col">
            <div className="flex flex-col text-regular">
              <img
                className="w-[102px] h-[102px] object-cover object-center border border-mono-300"
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
      <div className="flex flex-col items-center w-full ">
        {isLoading ? (
          <div className="text-regular">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : tokens.length === 0 ? (
          <div className="text-red-500">No coins fetched.</div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 justify-center md:justify-start">
            {tokens.map((token, index) => (
              <div key={index} className="w-full max-w-[406px] p-3 sm:p-3 lg:w-auto lg:p-0">
                <TokenCard key={token.mint} token={token} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
