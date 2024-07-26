import { Button } from "@/memechan-ui/Atoms";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import { colors } from "../../tailwind.config";

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
        <div className="w-10 h-10 border-primary-100">
          <Button className="text-primary-100 hover:text-mono-600" variant="secondary" onClick={() => setIsSearchActive(!isSearchActive)}>
            <FontAwesomeIcon icon={faSearch} onClick={() => setIsSearchActive(false)} />
          </Button>
        </div>
      )}

      {isSearchActive && (
        <TextInput
          value={search}
          placeholder="Search"
          setValue={setSearch}
          startAdornment={
            <span className="m-px mr-3 flex fa-">
              <FontAwesomeIcon size="sm" color={colors["mono-600"]} icon={faSearch} />
            </span>
          }
          endAdornment={
            <span className="cursor-pointer flex">
              <FontAwesomeIcon icon={faClose} size="lg" onClick={() => setIsSearchActive(false)} />
            </span>
          }
          className="py-2.5 pl-3 pr-4 rounded-sm pink-border"
        />
      )}
    </div>
  );
};
