import DarkThemeIcon from "@/memechan-ui/icons/DarkThemeIcon";
import LightThemeIcon from "@/memechan-ui/icons/LightThemeIcon";
import { motion } from "framer-motion";

export interface ThemeSwitcherProps {
  activeTheme: "light" | "dark";
  onClick: (variant: "light" | "dark") => void;
}

const ThemeSwitcher = ({ activeTheme, onClick }: ThemeSwitcherProps) => {
  return (
    <div className="relative flex bg-mono-300 p-1 rounded-sm max-w-fit gap-x-1">
      <motion.div
        className="absolute bg-mono-400 rounded-sm"
        initial={false}
        animate={{ x: activeTheme === "dark" ? 1 : 45 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ width: "40px", height: "40px", top: "5px" }}
      />
      <div
        role="button"
        className={`relative p-3 z-10 ${activeTheme === "dark" ? "text-mono-100" : ""} rounded-sm`}
        onClick={() => {
          if (activeTheme === "light") onClick("dark");
        }}
      >
        <DarkThemeIcon />
      </div>
      <div
        role="button"
        className={`relative p-3 z-10 ${activeTheme === "light" ? "text-mono-100" : ""} rounded-sm`}
        onClick={() => {
          if (activeTheme === "dark") onClick("light");
        }}
      >
        <LightThemeIcon />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
