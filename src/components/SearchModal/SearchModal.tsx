import { searchAtom } from "@/atoms";
import { BE_URL } from "@/common/solana";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { useQuery } from "@tanstack/react-query";
import { SolanaToken } from "memechan-sol-sdk";
import { useRecoilState } from "recoil";
import { useDebounceValue } from "usehooks-ts";
import { TokenCard } from "../TokenCard";
import NothingFound from "../nothingFound";

export const SearchModal = () => {
  const [search, setSearch] = useRecoilState(searchAtom);
  const [debouncedSearch] = useDebounceValue(search, 300);
  const isMoreThan2Letters = debouncedSearch.length > 2;

  const { data: tokens, isLoading } = useQuery<SolanaToken[]>({
    queryKey: ["token", "search", debouncedSearch],
    queryFn: () => getSearch(debouncedSearch),
    enabled: !!debouncedSearch && isMoreThan2Letters,
  });

  const isCoinsListEmpty = tokens?.length === 0 && !isLoading && isMoreThan2Letters;

  const handleTokenClick = () => {
    setSearch("");
  };

  return (
    <div className="w-full px-3 mt-3 sm:mt-6 xl:px-0">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-center w-full">
        {isLoading && <Typography variant="h4">Loading...</Typography>}
        {tokens?.map((token) => <TokenCard showOnClick key={token.address} token={token} onClick={handleTokenClick} />)}
      </div>
      {isCoinsListEmpty && (
        <NothingFound
          headerText="Nothing found"
          bodyText="Sorry, we couldn't find any results. How about a different query?"
        />
      )}
      {!isMoreThan2Letters && <Typography>Type 3 letters for search to query</Typography>}
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
