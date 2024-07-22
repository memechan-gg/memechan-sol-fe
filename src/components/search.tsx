import { Button } from "@/memechan-ui/Atoms";
import CancelIcon from "@/memechan-ui/icons/close-icon.svg";
import SearchIcon from "@/memechan-ui/icons/SearchIcon";
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
      className={`ml-1 sm:ml-4 h-10  dark flex items-center justify-center ${
        isSearchActive ? "w-auto ml-2" : "w-10"
      } transition-all duration-300 overflow-hidden`}
    >
      {/* <div className=" cursor-pointer w-10 h-10 flex justify-center" onClick={() => setIsSearchActive(!isSearchActive)}>
        <Image src={SearchIcon} alt="search icon" />
      </div> */}
      <div className="w-10 h-10 border-none">
        <Button variant="secondary" onClick={() => setIsSearchActive(true)}>
          <SearchIcon />
        </Button>
      </div>
      {/* TODO, Change input field with Input component */}
      {isSearchActive && (
        <div className="flex items-center w-full">
          <input
            type="text"
            className="w-full text-sm text-white font-normal bg-inherit px-2 py-1 border-none outline-none"
            placeholder="Search..."
          />
          {/* <div className=" cursor-pointer w-10 h-10 flex justify-center" onClick={() => setIsSearchActive(false)}>
            <Image src={CancelIcon} alt="cancel icon" />
          </div> */}
          <div className="w-10 h-10 border-pink" onClick={() => setIsSearchActive(false)}>
            <Button variant="secondary" onClick={() => setIsSearchActive(true)}>
              <Image src={CancelIcon} alt="cancel icon" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
