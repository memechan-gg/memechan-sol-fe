import { Button } from "@/memechan-ui/Atoms";
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
    <div>
      {!isSearchActive && (
        <div className="w-10 h-10 border-none">
          <Button variant="secondary" onClick={() => setIsSearchActive(!isSearchActive)}>
            <SearchIcon />
          </Button>
        </div>
      )}

      {isSearchActive && (
        <TextInput
          value={search}
          setValue={setSearch}
          startAdornment={<SearchIcon />}
          endAdornment={<CloseIcon onClick={() => setIsSearchActive(false)} />}
        />
      )}
    </div>
  );
};
