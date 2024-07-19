import SearchIcon from "@/ui-library/icons/search-icon.svg";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui-library/Button";

interface Props {
  isSearchActive: boolean;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
}

export const Search = ({ isSearchActive, setIsSearchActive, setSearch, search }: Props) => {
  return (
    <div
      className={`ml-1 pink-border dark flex items-center border-2 rounded ${isSearchActive ? "w-auto" : "w-10"} transition-all duration-300 overflow-hidden`}
    >
      <Button className="flex items-center justify-center w-10 h-10" onClick={() => setIsSearchActive(!isSearchActive)}>
        <Image src={SearchIcon} alt="search icon" />
      </Button>
      {isSearchActive && (
        <input
          type="text"
          className="w-auto bg-inherit px-2 py-1 border-none outline-none"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      )}
    </div>
  );
};
