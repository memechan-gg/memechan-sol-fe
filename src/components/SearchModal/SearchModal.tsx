import { searchAtom } from "@/atoms";
import { BE_URL } from "@/common/solana";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useDebounceValue } from "usehooks-ts";
import { TokenCard } from "../TokenCard";

export const SearchModal = () => {
  const search = useRecoilValue(searchAtom);

  const [debouncedSearch] = useDebounceValue(search, 300);
  const isMoreThen2Letters = debouncedSearch.length > 2;

  const { data: tokens, isLoading } = useQuery<SolanaToken[]>({
    queryKey: ["token", "search", debouncedSearch],
    queryFn: () => getSearch(debouncedSearch),
    enabled: !!debouncedSearch && isMoreThen2Letters,
  });

  const isCoinsListEmpty = tokens?.length === 0 && !isLoading && isMoreThen2Letters;

  return (
    <div className="fixed">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-center w-full">
        {isLoading && <Typography variant="h4">Loading...</Typography>}
        {tokens?.map((token) => (
          <TokenCard key={`${token.address}`} token={token} showCheckmark disableContent showOnClick />
        ))}
        {isCoinsListEmpty && <Typography>No memecoins yet</Typography>}
        {!isMoreThen2Letters && <Typography>Type 3 letters for search to query</Typography>}
      </div>
    </div>
  );
};

const getSearch = async (search: string) => {
  const response = await fetch(`${BE_URL}/sol/tokens/search?search=${search}`);
  if (!response.ok) {
    throw new Error(`Error fetching tokens: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
