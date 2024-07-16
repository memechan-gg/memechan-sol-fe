import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button } from "./ui-library/Button";

export const Search = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`pink-border dark flex items-center border-2 rounded ${isExpanded ? "w-72" : "w-10"} transition-all duration-300 overflow-hidden`}
    >
      <Button className="flex items-center justify-center w-10 h-10" onClick={() => setIsExpanded(!isExpanded)}>
        <FaSearch className="primary-pink" />
      </Button>
      {isExpanded && (
        <input type="text" className="w-full px-2 py-1 border-none outline-none" placeholder="Search..." />
      )}
    </div>
  );
};
