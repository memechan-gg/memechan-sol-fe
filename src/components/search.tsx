import { Button } from "@/memechan-ui/Atoms";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { inputVariants } from "@/utils/motionVariants";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export const Search = ({
  isSearchActive,
  setIsSearchActive,
  setSearch,
  search,
}: {
  isSearchActive: boolean;
  setIsSearchActive: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
}) => {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchActive]);

  return (
    <div>
      {!isSearchActive && (
        <div className="w-10 h-10 border-primary-100">
          <Button
            className={`${
              theme === "light"
                ? "text-primary-100 hover:text-mono-200 active:text-mono-200"
                : "text-primary-100 sm:hover:text-mono-600"
            }`}
            variant="secondary"
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </div>
      )}
      {isSearchActive && (
        <motion.div initial="hidden" animate="visible" exit="exit" variants={inputVariants} className="overflow-hidden">
          <TextInput
            ref={inputRef}
            value={search}
            placeholder="Search"
            setValue={setSearch}
            startAdornment={
              <span className="m-px mr-3 flex fa-">
                <FontAwesomeIcon size="sm" icon={faSearch} />
              </span>
            }
            endAdornment={
              <span className="cursor-pointer flex">
                <FontAwesomeIcon
                  icon={faClose}
                  size="lg"
                  onClick={() => {
                    setSearch("");
                    setIsSearchActive(false);
                  }}
                />
              </span>
            }
            className={`py-2.5 h-10 pl-3 pr-4 rounded-sm ${theme === "dark" ? "pink-border" : ""}`}
          />
        </motion.div>
      )}
    </div>
  );
};
