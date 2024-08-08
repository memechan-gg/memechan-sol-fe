import DarkThemeIcon from "@/memechan-ui/icons/DarkThemeIcon";
import LightThemeIcon from "@/memechan-ui/icons/LightThemeIcon";
import { track } from "@vercel/analytics";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [setTheme, systemTheme]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    track("ThemeChange", { theme: newTheme });
  };

  if (!mounted) return null;

  return (
    <div className={`relative flex p-1 rounded-sm max-w-fit gap-x-1 ${theme === "light" ? "" : "bg-mono-300"}`}>
      <motion.div
        className="absolute bg-mono-400 rounded-sm"
        initial={false}
        animate={{ x: theme === "dark" ? 1 : 45 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ width: "40px", height: "40px", top: "5px" }}
      />
      <div
        role="button"
        className={`relative p-3 z-10 ${theme === "dark" ? "text-mono-100" : ""} rounded-sm`}
        onClick={() => handleThemeChange("dark")}
      >
        <DarkThemeIcon />
      </div>
      <div
        role="button"
        className={`relative p-3 z-10 ${theme === "light" ? "text-mono-100" : ""} rounded-sm`}
        onClick={() => handleThemeChange("light")}
      >
        <LightThemeIcon />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
