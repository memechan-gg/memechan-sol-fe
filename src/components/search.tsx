import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import CloseIcon from "@/memechan-ui/icons/CloseIcon";
import SearchIcon from "@/memechan-ui/icons/SearchIcon";
import { Dispatch, SetStateAction, useState } from "react";

export const Search = ({
  isSearchActive,
  setIsSearchActive,
}: {
  isSearchActive: boolean;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const [search, setSearch] = useState("");
  return (
    <div
    // className={`ml-1 sm:ml-4 h-10 pink-border dark flex items-center border-none rounded ${
    //   isSearchActive ? "w-auto ml-2" : "w-10"
    // } transition-all duration-300 overflow-hidden`}
    >
      {!isSearchActive && (
        <span onClick={() => setIsSearchActive(!isSearchActive)} className="hover:opacity-75 cursor-pointer">
          <SearchIcon />
        </span>
      )}

      {isSearchActive && (
        <TextInput
          value={search}
          placeholder="Search"
          setValue={setSearch}
          startAdornment={<SearchIcon />}
          endAdornment={<CloseIcon onClick={() => setIsSearchActive(false)} />}
        />
      )}
    </div>
  );
};
