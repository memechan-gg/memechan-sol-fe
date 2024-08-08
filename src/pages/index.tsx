import { searchAtom } from "@/atoms";
import { BE_URL } from "@/common/solana";
import { TokenCard } from "@/components/TokenCard";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Home } from "@/views/home";
import { SolanaToken } from "@avernikoz/memechan-sol-sdk";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

export default function HomePage() {
  const search = useRecoilValue(searchAtom);

  return search ? <SearchModal /> : <Home />;
}

const SearchModal = () => {
  const search = useRecoilValue(searchAtom);
  const { data: tokens, isLoading } = useQuery<SolanaToken[]>({
    queryKey: ["token", "search", search],
    queryFn: () => getSearch(search),
  });
  const isCoinsListEmpty = tokens?.length === 0 && !isLoading;

  // todo:debounce:
  // todo:put modal somewhere so its availiable on all pages
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-center w-full">
      {isLoading && <Typography variant="h4">Loading...</Typography>}
      {tokens?.map((token) => (
        <TokenCard key={`${token.address}`} token={token} showCheckmark disableContent showOnClick />
      ))}
      {isCoinsListEmpty && <Typography>No memecoins yet</Typography>}
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
