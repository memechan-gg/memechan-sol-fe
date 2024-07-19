import { Button } from "@/memechan-ui/Atoms/Button";
import CancelIcon from "@/memechan-ui/icons/close-icon.svg";
import SearchIcon from "@/memechan-ui/icons/search-icon.svg";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export const Search = ({
  isSearchActive,
  setIsSearchActive,
}: {
  isSearchActive: boolean;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className={`ml-1 sm:ml-4 h-10 pink-border dark flex items-center border-none rounded ${
        isSearchActive ? "w-auto ml-2" : "w-10"
      } transition-all duration-300 overflow-hidden`}
    >
      <Button type="primary" onClick={() => setIsSearchActive(!isSearchActive)}>
        <Image src={SearchIcon} alt="search icon" />
      </Button>
      {isSearchActive && (
        <div className="flex items-center w-full">
          <input
            type="text"
            className="w-full text-sm text-white font-normal bg-inherit px-2 py-1 border-none outline-none"
            placeholder="Search..."
          />
          <Button type="secondary" onClick={() => setIsSearchActive(false)}>
            <Image src={CancelIcon} alt="cancel icon" />
          </Button>
        </div>
      )}
    </div>
  );
};
