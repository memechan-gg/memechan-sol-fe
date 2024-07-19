import CancelIcon from "@/ui-library/icons/close-icon.svg";
import SearchIcon from "@/ui-library/icons/search-icon.svg";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui-library/Button";

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
      <Button
        className="flex items-center justify-center hover:bg-primary-100 w-10 h-10"
        onClick={() => setIsSearchActive(!isSearchActive)}
      >
        <Image src={SearchIcon} alt="search icon" />
      </Button>
      {isSearchActive && (
        <div className="flex items-center w-full">
          <input
            type="text"
            className="w-full text-sm text-white font-normal bg-inherit px-2 py-1 border-none outline-none"
            placeholder="Search..."
          />
          <Button className="flex items-center justify-center w-10 h-10" onClick={() => setIsSearchActive(false)}>
            <Image src={CancelIcon} alt="cancel icon" />
          </Button>
        </div>
      )}
    </div>
  );
};
