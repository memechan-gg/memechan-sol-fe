import { searchAtom } from "@/atoms";
import { BE_URL } from "@/common/solana";
import { Home } from "@/views/home";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

export default function HomePage() {
  const search = useRecoilValue(searchAtom);

  return search ? <SearchModal search={search} /> : <Home />;
}

const SearchModal = ({ search }: { search: string }) => {
  const { data } = useQuery({ queryKey: ["token", "search", search], queryFn: () => getSearch(search) });
  console.log(data);
  return <>{JSON.stringify(data)}</>;
};

const getSearch = async (search: string) => {
  const response = await fetch(`${BE_URL}/sol/tokens/search?search=${search}`);
  if (!response.ok) {
    throw new Error(`Error fetching tokens: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
