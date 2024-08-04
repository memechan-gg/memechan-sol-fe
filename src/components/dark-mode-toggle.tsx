import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { track } from "@vercel/analytics";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    track("ThemeChange", { theme: newTheme });

    setTheme(newTheme);
  };

  if (!mounted) return null;
  return (
    <div className="hidden sm:flex justify-center lg:bg-transparent bg-board dark:bg-dark">
      <button
        className="bg-title bg-opacity-15 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 sm:hover:bg-opacity-25"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  );
};

export default DarkModeToggle;
